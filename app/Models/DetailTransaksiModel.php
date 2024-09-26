<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DetailTransaksiModel extends Model
{
    use HasFactory;
    public $table = 'detail_transaksi';
    public $primaryKey = 'id_detail_transaksi';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id_transaksi',
        'id_menu',
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
    public function menuRelations()
    {
        return $this->belongsTo(MenuModel::class, 'id_menu', 'id_menu');
    }

}
