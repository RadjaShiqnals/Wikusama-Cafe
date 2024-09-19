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
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->uuid('id_detail_transaksi')->primary();
            $table->uuid('id_transaksi');
            $table->uuid('id_menu');
            $table->integer('harga');
            $table->timestamps();

            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksi')->onDelete('cascade');
            $table->foreign('id_menu')->references('id_menu')->on('menu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
