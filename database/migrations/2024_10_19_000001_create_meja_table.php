<?php use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('meja', function (Blueprint $table) {
            $table->char('id_meja', 36)->primary();
            $table->string('nomor_meja');
            $table->enum('status', ['available', 'used']);
            $table->timestamps();
            $table->softDeletes(); }); }
    public function down(): void
    {
        Schema::dropIfExists('meja'); }
};
