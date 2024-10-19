<?php use Illuminate\Database\Migrations\Migration;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->char('id_detail_transaksi', 36)->primary();
            $table->char('id_transaksi', 36);
            $table->char('id_menu', 36);
            $table->integer('harga');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('id_transaksi')->references('id_transaksi')->on('transaksi')->onDelete('cascade');
            $table->foreign('id_menu')->references('id_menu')->on('menu')->onDelete('cascade'); });
    }
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
