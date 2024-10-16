<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransaksiModel extends Model
{
    use HasFactory, SoftDeletes;
    public $table = 'transaksi';
    public $primaryKey = 'id_transaksi';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'tgl_transaksi',
        'id_user',
        'id_meja',
        'nama_pelanggan',
        'status',
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

    public function userRelations()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function mejaRelations()
    {
        return $this->belongsTo(MejaModel::class, 'id_meja', 'id_meja');
    }
    public function detailTransaksiRelations()
    {
        return $this->hasMany(DetailTransaksiModel::class, 'id_transaksi', 'id_transaksi');
    }
}
