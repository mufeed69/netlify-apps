export default function numberToWords(num) {
    const a = [
        '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
    ];
    const b = [
        '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
    ];

    const n = (num, suffix) => {
        if (num === 0) return '';
        if (num <= 19) return a[num] + ' ' + suffix;
        if (num <= 99) return b[Math.floor(num / 10)] + ' ' + a[num % 10] + ' ' + suffix;
        if (num <= 999) return a[Math.floor(num / 100)] + ' HUNDRED ' + n(num % 100, '');
        if (num <= 99999) return n(Math.floor(num / 1000), 'THOUSAND ') + n(num % 1000, '');
        if (num <= 9999999) return n(Math.floor(num / 100000), 'LAKH ') + n(num % 100000, '');
        return n(Math.floor(num / 10000000), 'CRORE ') + n(num % 10000000, '');
    };

    const [integerPart, decimalPart] = num.toString().split('.');
    const words = n(parseInt(integerPart), '').trim();
    const decimalWords = parseInt(decimalPart) ? 'AND ' + n(parseInt(decimalPart), '') + 'PAISA' : '';

    return ((words ? words + ' RUPEES ONLY' : '') + decimalWords).trim();
};
