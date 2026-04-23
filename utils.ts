export const generateOrderID = () => 'vpr' + Math.floor(100000 + Math.random() * 900000).toString();

export const generateReferralCode = () => 'VPC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2,5).toUpperCase();

export const getTikTokId = (url: string) => { if(!url) return null; const m = url.match(/(\d{15,25})/); return m ? m[1] : null; };

export const getYouTubeId = (url: string) => { if(!url) return null; const m = url.match(/(?:v=|youtu\.be\/)([^"&?\/\s]{11})/); return m ? m[1] : null; };

export const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

export const generateDynamicQRIS = (baseQRIS: string, amount: number) => {
  let qris = baseQRIS.slice(0, -8);
  if (amount) { 
    let amtStr = amount.toString(); 
    let amtLen = amtStr.length.toString().padStart(2, '0'); 
    qris += `54${amtLen}${amtStr}`; 
  }
  qris += "6304"; 
  let crc = 0xFFFF;
  for (let i = 0; i < qris.length; i++) { 
    crc ^= qris.charCodeAt(i) << 8; 
    for (let j = 0; j < 8; j++) { 
      if ((crc & 0x8000) !== 0) crc = ((crc << 1) ^ 0x1021) & 0xFFFF; 
      else crc = (crc << 1) & 0xFFFF; 
    } 
  }
  return qris + crc.toString(16).toUpperCase().padStart(4, '0');
};

export const compressImage = async (fileOrDataUrl: File | string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const processImg = (src: string) => {
        const img = new Image(); img.src = src;
        img.onload = () => {
          const canvas = document.createElement('canvas'); let w = img.width, h = img.height;
          if (w > h) { if (w > maxWidth) { h *= maxWidth / w; w = maxWidth; } } else { if (h > maxWidth) { w *= maxWidth / h; h = maxWidth; } }
          canvas.width = w; canvas.height = h; canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
    };
    if (typeof fileOrDataUrl === 'string') processImg(fileOrDataUrl); 
    else { const reader = new FileReader(); reader.readAsDataURL(fileOrDataUrl); reader.onload = (e) => processImg(e.target!.result as string); }
  });
};

export const adjustColor = (color: string, amount: number) => '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));

export const calculateVIPLevel = (txCount: number) => { 
  if (txCount >= 100) return { level: 'Platinum', badge: '💎', color: 'text-cyan-400 border-cyan-500 bg-cyan-500/10', cashback: 0.05 }; 
  if (txCount >= 30) return { level: 'Gold', badge: '🥇', color: 'text-yellow-400 border-yellow-500 bg-yellow-500/10', cashback: 0.03 }; 
  if (txCount >= 10) return { level: 'Silver', badge: '🥈', color: 'text-gray-300 border-gray-400 bg-gray-500/20', cashback: 0.015 }; 
  return { level: 'Bronze', badge: '🥉', color: 'text-primary border-primary bg-primary-light', cashback: 0 }; 
}

export const getDisplayPrice = (item: any) => {
    return Number(item.price) + Number(item.adminProfit || 0);
};

export const calculateFinalPrice = (basePrice: number, _itemId?: string) => {
    return basePrice; 
};

