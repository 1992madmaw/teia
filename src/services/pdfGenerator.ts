import { jsPDF } from 'jspdf';
import type { Budget, Empresa } from './storage';

const fmp = (n: number) => 'R$ ' + (n || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const generatePDF = (budget: Budget, empresa: Empresa, logoB64: string | null) => {
  const numero = budget.numero || '001';
  const dataDoc = budget.data || new Date().toLocaleDateString('pt-BR');
  const validade = empresa.validade || '15';
  
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297, mg = 15, cw = W - mg * 2;

  const wh: [number, number, number] = [255, 255, 255];
  const dk: [number, number, number] = [25, 30, 45];
  const mid: [number, number, number] = [100, 108, 120];
  const brd: [number, number, number] = [210, 214, 222];
  const alt: [number, number, number] = [247, 248, 250];
  const acc: [number, number, number] = [30, 58, 95];

  doc.setFillColor(...wh);
  doc.rect(0, 0, W, H, 'F');

  doc.setDrawColor(...brd);
  doc.setLineWidth(0.4);
  doc.line(mg, 52, W - mg, 52);

  let logoRight = mg;
  if (logoB64) {
    try {
      const ext = logoB64.includes('png') ? 'PNG' : 'JPEG';
      doc.addImage(logoB64, ext, mg, 10, 28, 28);
      logoRight = mg + 32;
    } catch (e) {
      console.error('Erro ao adicionar logo ao PDF', e);
    }
  }

  const empAreaW = 90;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...dk);
  const nomeEmp = empresa.nome || 'Minha Empresa';
  const nomeMax = doc.splitTextToSize(nomeEmp, empAreaW);
  doc.text(nomeMax[0], logoRight, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mid);
  let iy = 25;
  if (empresa.doc) { doc.text('CNPJ/CPF: ' + empresa.doc, logoRight, iy); iy += 5; }
  if (empresa.tel) { doc.text('Tel: ' + empresa.tel, logoRight, iy); iy += 5; }
  if (empresa.email) { doc.text(empresa.email, logoRight, iy); iy += 5; }
  if (empresa.end) { doc.text(empresa.end, logoRight, iy); }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...dk);
  doc.text('ORÇAMENTO', W - mg, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mid);
  doc.text(`Nº ${numero}`, W - mg, 27, { align: 'right' });
  doc.text(`Data: ${dataDoc}`, W - mg, 33, { align: 'right' });
  doc.text(`Válido por ${validade} dias`, W - mg, 39, { align: 'right' });

  let y = 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...mid);
  doc.text('CLIENTE', mg, y);
  y += 5;
  doc.setDrawColor(...brd);
  doc.setLineWidth(0.3);
  doc.line(mg, y, W - mg, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...dk);
  doc.text(budget.cliente, mg, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mid);
  const tc = budget.telCliente;
  const loc = budget.local;
  let cx = mg;
  if (tc) { doc.text('Tel: ' + tc, cx, y); cx += 70; }
  if (loc) { doc.text('Local: ' + loc, cx, y); }
  y += 10;

  doc.setDrawColor(...brd);
  doc.setLineWidth(0.3);
  doc.line(mg, y, W - mg, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...mid);
  doc.text('SERVIÇOS E PRODUTOS', mg, y);
  y += 4;

  doc.setFillColor(...alt);
  doc.rect(mg, y, cw, 8, 'F');
  doc.setDrawColor(...brd);
  doc.setLineWidth(0.3);
  doc.rect(mg, y, cw, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...mid);
  doc.text('Descrição', mg + 4, y + 5.5);
  doc.text('Qtd', mg + cw * 0.63, y + 5.5, { align: 'center' });
  doc.text('Unit.', mg + cw * 0.79, y + 5.5, { align: 'center' });
  doc.text('Total', mg + cw - 2, y + 5.5, { align: 'right' });
  y += 8;

  budget.items.forEach((it, i) => {
    const rh = 9;
    if (i % 2 !== 0) { doc.setFillColor(...alt); doc.rect(mg, y, cw, rh, 'F'); }
    doc.setDrawColor(...brd);
    doc.setLineWidth(0.2);
    doc.line(mg, y + rh, mg + cw, y + rh);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...dk);
    const dt = it.desc.length > 46 ? it.desc.substring(0, 46) + '…' : it.desc;
    doc.text(dt, mg + 4, y + 6);
    doc.setTextColor(...mid);
    doc.text(String(it.qtd), mg + cw * 0.63, y + 6, { align: 'center' });
    doc.text(fmp(it.valor), mg + cw * 0.79, y + 6, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...dk);
    doc.text(fmp(it.qtd * it.valor), mg + cw - 2, y + 6, { align: 'right' });
    y += rh;
  });

  y += 4;
  const total = budget.items.reduce((s, i) => s + i.qtd * i.valor, 0);
  doc.setDrawColor(...brd);
  doc.setLineWidth(0.3);
  doc.setFillColor(235, 240, 248);
  doc.roundedRect(mg, y, cw, 13, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...mid);
  doc.text('TOTAL GERAL', mg + 5, y + 8.5);
  doc.setFontSize(13); doc.setTextColor(...acc);
  doc.text(fmp(total), mg + cw - 3, y + 9, { align: 'right' });
  y += 19;

  const pag = budget.pagamento;
  const prazo = budget.prazo;
  if (pag || prazo) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...mid);
    doc.text('CONDIÇÕES', mg, y); y += 4;
    doc.setDrawColor(...brd); doc.setLineWidth(0.3); doc.line(mg, y, W - mg, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...dk);
    if (pag) doc.text('Pagamento: ' + pag, mg, y);
    if (prazo) doc.text('Prazo de execução: ' + prazo, mg + 95, y);
    y += 12;
    doc.setDrawColor(...brd); doc.setLineWidth(0.3); doc.line(mg, y, W - mg, y);
    y += 8;
  }

  const obs = budget.obs || empresa.obs;
  if (obs) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...mid);
    doc.text('OBSERVAÇÕES', mg, y); y += 4;
    doc.setDrawColor(...brd); doc.setLineWidth(0.3); doc.line(mg, y, W - mg, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...mid);
    const lines = doc.splitTextToSize(obs, cw);
    doc.text(lines.slice(0, 3), mg, y);
    y += lines.slice(0, 3).length * 5 + 6;
    doc.setDrawColor(...brd); doc.setLineWidth(0.3); doc.line(mg, y, W - mg, y);
    y += 8;
  }

  y = Math.max(y, H - 50);
  doc.setDrawColor(...brd); doc.setLineWidth(0.5);
  const sw = 80, sx = mg + (cw - sw) / 2;
  doc.line(sx, y, sx + sw, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...dk);
  doc.text(empresa.nome || 'Prestador de Serviço', sx + sw / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...mid);
  doc.text('Assinatura / Aceite do Cliente', sx + sw / 2, y + 12, { align: 'center' });

  doc.setDrawColor(...brd); doc.setLineWidth(0.3); doc.line(mg, H - 10, W - mg, H - 10);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...mid);
  doc.text('euCotei.com – Orçamentos Profissionais', W / 2, H - 4, { align: 'center' });

  doc.save(`orcamento-${numero}-${budget.cliente.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};
