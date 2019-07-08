var mongoose = require('mongoose');

PurchaseSchema = new mongoose.Schema({
    supplierName: String, // Name Customer
    purchaseType: String,// 1beli, 2beli, 3beli
    purchaseDate: Date,  // Estimasi tanggal kedatangan
    purchaseStatus: String, // Status pesanan,Menunggu Konfirmasi, Order di Proses, Sudah di kirim, Selesai di edit di /order/:id/edit
    purchaseDetail: Object  //Detail pesanan
});

module.exports = mongoose.model("Purchase", PurchaseSchema);