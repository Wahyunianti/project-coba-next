class Utilities {
  private formatter: Intl.NumberFormat;

  constructor() {
    this.formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  }

  formatRupiah(amount: number): string {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  }

  UUIDInt() {
    return Math.floor(Math.random() * 2_000_000_000);
  }
}

export default Utilities;
