var mongoose = require('mongoose');

//Schema Setup
var OrderSchema = new mongoose.Schema({
    custName: String, // Name Customer
    orderType: String,// Skema Harga (20gros, dll)
    phoneNum: Number, // No Telp
    isBuying: Boolean,// Pembelian atau Penjualan
    orderDate: Date,  // Estimasi tanggal kedatangan
    orderCode: String,// Random String
    orderStatus: String, // Status pesanan,Menunggu Konfirmasi, Order di Proses, Sudah di kirim, Selesai di edit di /order/:id/edit
    orderDetail: Object  //Detail pesanan
});

module.exports = mongoose.model("Order", OrderSchema);