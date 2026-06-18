#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Offline Venue Manager - License Token Issuer
--------------------------------------------
برنامج بسيط ومرتب لتوليد التوكنات الخاصة بالتطبيق.

الحقول التي يفهمها التطبيق الحالي:
- shopName
- planType
- issuedAtUtc
- startsAtUtc
- expiresAtUtc
- installationId
- deviceHintsHash
- stationLimit
- buildConstraint
- signatureVersion

مهم جداً:
إذا أضفت حقولاً جديدة هنا، لن يقبلها التطبيق الحالي إلا إذا عدلت
كود Flutter أيضاً داخل license_payload.dart و license_verifier.dart.
"""

from __future__ import annotations

import base64
import json
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat


TOKEN_PREFIX = "PT1"

# إذا وضعت المفتاح الخاص هنا، لن يطلبه البرنامج منك كل مرة.
# اتركه فارغاً إذا كنت تريد إدخاله يدوياً.
DEFAULT_PRIVATE_KEY_B64 = ""

# قيم افتراضية منظمة
DEFAULT_PLAN = "trial"
DEFAULT_DURATION_DAYS = 14
DEFAULT_STATION_LIMIT = 10
DEFAULT_BUILD_CONSTRAINT = "1.0.0+1"
DEFAULT_SIGNATURE_VERSION = 1

LOCAL_TZ = datetime.now().astimezone().tzinfo


@dataclass
class LicensePayload:
    shop_name: str
    plan_type: str
    issued_at_utc: datetime
    starts_at_utc: datetime
    expires_at_utc: datetime
    installation_id: str
    device_hints_hash: str
    station_limit: int
    build_constraint: Optional[str]
    signature_version: int

    def to_dict(self) -> dict:
        # الترتيب مهم حتى يبقى الـ JSON ثابتاً أثناء التوقيع والتحقق
        return {
            "shopName": self.shop_name,
            "planType": self.plan_type,
            "issuedAtUtc": iso_utc(self.issued_at_utc),
            "startsAtUtc": iso_utc(self.starts_at_utc),
            "expiresAtUtc": iso_utc(self.expires_at_utc),
            "installationId": self.installation_id,
            "deviceHintsHash": self.device_hints_hash,
            "stationLimit": self.station_limit,
            "buildConstraint": self.build_constraint,
            "signatureVersion": self.signature_version,
        }

    def to_canonical_json(self) -> str:
        return json.dumps(
            self.to_dict(),
            ensure_ascii=False,
            separators=(",", ":"),
        )


class TokenIssuer:
    def __init__(self, private_key_b64: str):
        private_key_bytes = b64url_decode(private_key_b64)
        if len(private_key_bytes) != 32:
            raise ValueError(
                f"المفتاح الخاص غير صالح. يجب أن يكون 32 بايت بعد فك Base64Url، لكن الموجود هو {len(private_key_bytes)} بايت."
            )

        self.private_key = Ed25519PrivateKey.from_private_bytes(private_key_bytes)
        self.public_key_b64 = b64url_encode(
            self.private_key.public_key().public_bytes(
                encoding=Encoding.Raw,
                format=PublicFormat.Raw,
            )
        )

    def sign_token(self, payload: LicensePayload) -> str:
        payload_json = payload.to_canonical_json()
        payload_bytes = payload_json.encode("utf-8")
        signature = self.private_key.sign(payload_bytes)

        return (
            f"{TOKEN_PREFIX}."
            f"{b64url_encode(payload_bytes)}."
            f"{b64url_encode(signature)}"
        )


def b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def b64url_decode(text: str) -> bytes:
    text = text.strip()
    padding = "=" * (-len(text) % 4)
    return base64.urlsafe_b64decode(text + padding)


def iso_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")


def line() -> None:
    print("=" * 72)


def title(text: str) -> None:
    print()
    line()
    print(text)
    line()


def ask_required(label: str, default: Optional[str] = None) -> str:
    while True:
        if default is not None and default != "":
            value = input(f"{label} [{default}]: ").strip()
            if not value:
                return default
            return value

        value = input(f"{label}: ").strip()
        if value:
            return value

        print("هذه القيمة إجبارية ولا يمكن تركها فارغة.")


def ask_optional(label: str, default: Optional[str] = None) -> Optional[str]:
    if default is not None:
        value = input(f"{label} [{default}]: ").strip()
        return value if value else default

    value = input(f"{label} [اختياري]: ").strip()
    return value or None


def ask_int(label: str, default: Optional[int] = None, min_value: Optional[int] = None) -> int:
    while True:
        if default is not None:
            raw = input(f"{label} [{default}]: ").strip()
            if raw == "":
                value = default
            else:
                try:
                    value = int(raw)
                except ValueError:
                    print("الرجاء إدخال رقم صحيح.")
                    continue
        else:
            raw = input(f"{label}: ").strip()
            try:
                value = int(raw)
            except ValueError:
                print("الرجاء إدخال رقم صحيح.")
                continue

        if min_value is not None and value < min_value:
            print(f"القيمة يجب أن تكون أكبر أو تساوي {min_value}.")
            continue

        return value


def ask_choice(label: str, choices: list[str], default: str) -> str:
    normalized = {c.lower(): c for c in choices}
    choices_display = "/".join(choices)

    while True:
        raw = input(f"{label} [{default}] ({choices_display}): ").strip().lower()
        if not raw:
            return default
        if raw in normalized:
            return raw
        print(f"الخيار غير صالح. الخيارات المتاحة: {choices_display}")


def parse_user_datetime(raw: str) -> datetime:
    raw = raw.strip()
    if not raw:
        raise ValueError("Empty date string")

    formats = [
        "%Y-%m-%d",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%d %H:%M:%S",
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(raw, fmt)
            return dt.replace(tzinfo=LOCAL_TZ).astimezone(timezone.utc)
        except ValueError:
            pass

    try:
        dt = datetime.fromisoformat(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=LOCAL_TZ)
        return dt.astimezone(timezone.utc)
    except ValueError:
        raise ValueError(
            "صيغة التاريخ غير صحيحة. استخدم مثلاً: 2026-03-13 أو 2026-03-13 18:30"
        )


def ask_datetime(label: str, default: datetime) -> datetime:
    while True:
        raw = input(f"{label} [{default.astimezone(LOCAL_TZ).strftime('%Y-%m-%d %H:%M')}]: ").strip()
        if not raw:
            return default.astimezone(timezone.utc)
        try:
            return parse_user_datetime(raw)
        except ValueError as exc:
            print(exc)


def generate_keys() -> None:
    title("توليد مفاتيح جديدة")

    private_key = Ed25519PrivateKey.generate()
    private_key_bytes = private_key.private_bytes_raw()
    public_key_bytes = private_key.public_key().public_bytes(
        encoding=Encoding.Raw,
        format=PublicFormat.Raw,
    )

    print("PRIVATE KEY (سري جداً - لا تعطه لأي أحد):")
    print(b64url_encode(private_key_bytes))
    print()
    print("PUBLIC KEY (تضعه مع flutter run):")
    print(b64url_encode(public_key_bytes))
    print()
    print("أمر التشغيل:")
    print(
        f'flutter run --dart-define=LICENSE_PUBLIC_KEY_B64={b64url_encode(public_key_bytes)} '
        f'--dart-define=APP_BUILD={DEFAULT_BUILD_CONSTRAINT}'
    )


def decode_token() -> None:
    title("قراءة Token")

    token = ask_required("ألصق الـ Token")
    parts = token.split(".")

    if len(parts) != 3 or parts[0] != TOKEN_PREFIX:
        print("صيغة التوكن غير صحيحة.")
        return

    try:
        payload_bytes = b64url_decode(parts[1])
        payload_json = payload_bytes.decode("utf-8")
        payload = json.loads(payload_json)
    except Exception as exc:
        print(f"فشل فك التوكن: {exc}")
        return

    print("\nPayload:")
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def issue_token_interactive() -> None:
    title("توليد Token جديد")

    print("الحقول الإجبارية:")
    print("- اسم المحل")
    print("- نوع الخطة")
    print("- Installation ID")
    print("- Device fingerprint")
    print("- مدة التفعيل")
    print("- عدد المحطات")
    print()
    print("الحقول الاختيارية:")
    print("- Build Constraint")
    print("- Start Date")
    print("- Issue Date")
    print()

    private_key_b64 = DEFAULT_PRIVATE_KEY_B64.strip() or ask_required("المفتاح الخاص PRIVATE KEY")
    issuer = TokenIssuer(private_key_b64)

    print("\nPUBLIC KEY الناتج من هذا المفتاح:")
    print(issuer.public_key_b64)
    print()

    shop_name = ask_required("اسم المحل")
    plan_type = ask_choice("نوع الخطة", ["trial", "subscription"], DEFAULT_PLAN)
    installation_id = ask_required("Installation ID")
    device_hints_hash = ask_required("Device fingerprint")
    duration_days = ask_int("مدة التفعيل بالأيام", DEFAULT_DURATION_DAYS, min_value=1)
    station_limit = ask_int("عدد المحطات المسموح بها", DEFAULT_STATION_LIMIT, min_value=1)

    now_utc = datetime.now(timezone.utc)
    starts_at_utc = ask_datetime("تاريخ البداية", now_utc)
    issued_at_utc = ask_datetime("تاريخ الإصدار", now_utc)

    build_constraint = ask_optional(
        "Build Constraint",
        DEFAULT_BUILD_CONSTRAINT,
    )
    if build_constraint is not None and build_constraint.strip() == "":
        build_constraint = None

    signature_version = ask_int(
        "Signature Version",
        DEFAULT_SIGNATURE_VERSION,
        min_value=1,
    )

    expires_at_utc = starts_at_utc + timedelta(days=duration_days)

    payload = LicensePayload(
        shop_name=shop_name,
        plan_type=plan_type,
        issued_at_utc=issued_at_utc,
        starts_at_utc=starts_at_utc,
        expires_at_utc=expires_at_utc,
        installation_id=installation_id,
        device_hints_hash=device_hints_hash,
        station_limit=station_limit,
        build_constraint=build_constraint or None,
        signature_version=signature_version,
    )

    token = issuer.sign_token(payload)

    title("النتيجة النهائية")

    print("PUBLIC KEY:")
    print(issuer.public_key_b64)
    print()

    print("TOKEN:")
    print(token)
    print()

    print("PAYLOAD:")
    print(json.dumps(payload.to_dict(), ensure_ascii=False, indent=2))
    print()

    print("أمر تشغيل التطبيق:")
    build_value = build_constraint or DEFAULT_BUILD_CONSTRAINT
    print(
        f'flutter run --dart-define=LICENSE_PUBLIC_KEY_B64={issuer.public_key_b64} '
        f'--dart-define=APP_BUILD={build_value}'
    )


def main() -> None:
    while True:
        title("Offline Venue Manager - Token Issuer")

        print("1. توليد مفاتيح جديدة")
        print("2. توليد Token")
        print("3. قراءة Token")
        print("0. خروج")
        print()

        choice = input("اختر رقم العملية: ").strip()

        try:
            if choice == "1":
                generate_keys()
            elif choice == "2":
                issue_token_interactive()
            elif choice == "3":
                decode_token()
            elif choice == "0":
                print("تم الإغلاق.")
                return
            else:
                print("الخيار غير صالح.")
        except KeyboardInterrupt:
            print("\nتم الإلغاء من المستخدم.")
        except Exception as exc:
            print(f"\nحدث خطأ: {exc}")

        print()
        input("اضغط Enter للمتابعة...")


if __name__ == "__main__":
    main()
