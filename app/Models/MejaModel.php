<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class MejaModel extends Model
{
    use HasFactory, SoftDeletes;
    public $table = 'meja';
    public $primaryKey = 'id_meja';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'nomor_meja',
        'status'
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
