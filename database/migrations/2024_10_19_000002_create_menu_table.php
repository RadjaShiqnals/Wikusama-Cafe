<?php use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('menu', function (Blueprint $table) {
            $table->char('id_menu', 36)->primary();
            $table->string('nama_menu', 100);
            $table->enum('jenis', ['makanan', 'minuman']);
            $table->string('deskripsi', 255);
            $table->string('gambar', 255);
            $table->integer('harga');
            $table->timestamps();
            $table->softDeletes(); }); }
    public function down(): void
    {
        Schema::dropIfExists('menu'); }
};
