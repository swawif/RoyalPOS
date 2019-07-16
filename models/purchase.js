var mongoose = require('mongoose');

PurchaseSchema = new mongoose.Schema({
    name: String, // Name Customer, formerly supplierName
    type: {
        name: {type:String, lowercase: true},
        price: Number
        },  // 1beli, 2beli, 3beli, formerly purchaseType, linked to purchaseSchema
    date: Date,  // Estimasi tanggal kedatangan, formerly purchaseDate
    status: Number, // Status pesanan,Menunggu Konfirmasi, Order di Proses, Sudah di kirim, Selesai di edit di /order/:id/edit, formerly purchaseStatus
    detail: Object  //Detail pesanan, formerly purchaseDetail
});

module.exports = mongoose.model("Purchase", PurchaseSchema);