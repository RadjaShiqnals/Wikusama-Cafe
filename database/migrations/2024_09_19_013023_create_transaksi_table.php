<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->uuid('id_transaksi')->primary();
            $table->timestamp('tgl_transaksi');
            $table->uuid('id_user');
            $table->uuid('id_meja');
            $table->string('nama_pelanggan', 100);
            $table->enum('status', ['belum_bayar', 'lunas']);
            $table->timestamps();

            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_meja')->references('id_meja')->on('meja')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
