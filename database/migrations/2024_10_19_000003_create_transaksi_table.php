<?php use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->char('id_transaksi', 36)->primary();
            $table->timestamp('tgl_transaksi')->useCurrent()->useCurrentOnUpdate();
            $table->char('id_user', 36);
            $table->char('id_meja', 36);
            $table->string('nama_pelanggan', 100);
            $table->enum('status', ['belum_bayar', 'lunas']);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_meja')->references('id_meja')->on('meja')->onDelete('cascade'); }); }
    public function down(): void
    {
        Schema::dropIfExists('transaksi'); }
};
