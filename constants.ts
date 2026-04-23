export const safeAppId = 'vipercell-app'; 
export const ADMIN_EMAIL = "millerstoreid@gmail.com";
export const BASE_QRIS = "00020101021126670016COM.NOBUBANK.WWW01189360050300000903200214528469863669210303UMI51440014ID.CO.QRIS.WWW0215ID20253717051660303UMI5204812533033605802ID5912MILLER TEVES6005AMBON61059723262070703A01630416A3";

export const PAYMENTS = [ 
  { id: 'saldo', name: 'Saldo Akun (E-Wallet)', type: 'Bayar Otomatis', fee: 0, color: 'from-blue-600 to-blue-800', badge: 'WALLET' }, 
  { id: 'qris', name: 'QRIS Dinamis', type: 'Scan Barcode', fee: 0, color: 'from-blue-500 to-indigo-500', badge: 'QRIS' }, 
  { id: 'cash', name: 'Uang Tunai (Cash)', type: 'Bayar Kasir', fee: 0, color: 'from-emerald-500 to-green-600', badge: 'CASH' } 
];
