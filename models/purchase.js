var mongoose = require('mongoose');

PurchaseSchema = new mongoose.Schema({
    supplierName: String, // Name Customer
    purchaseType: String,// Skema Harga (20gros, dll)
    phoneNum: Number, // No Telp
    purchaseDate: Date,  // Estimasi tanggal kedatangan
    orderStatus: String, // Status pesanan,Menunggu Konfirmasi, Order di Proses, Sudah di kirim, Selesai di edit di /order/:id/edit
    orderDetail: Object  //Detail pesanan
});

module.exports = mongoose.model("Purchase", PurchaseSchema);