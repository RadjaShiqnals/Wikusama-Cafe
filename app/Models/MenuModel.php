<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MenuModel extends Model
{
    use HasFactory;
    public $table = 'menu';
    public $primaryKey = 'id_menu';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'nama_menu',
        'jenis',
        'deskripsi',
        'gambar',
        'harga',
    ];
    public $timestamps = true;
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
