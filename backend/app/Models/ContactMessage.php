<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    public const STATUS_NEW = 'new';

    public const STATUS_READ = 'read';

    public const STATUS_REPLIED = 'replied';

    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'phone',
        'message',
        'source',
        'page_url',
        'ip_address',
        'user_agent',
        'locale',
        'status',
        'whatsapp_sent_at',
        'whatsapp_error',
    ];

    protected $casts = [
        'whatsapp_sent_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
