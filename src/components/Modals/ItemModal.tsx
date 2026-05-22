import React, { useState } from 'react';
import type { BudgetItem } from '../../services/storage';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

interface ItemModalProps {
  onClose: () => void;
  onAdd: (item: BudgetItem) => void;
  onToast: (msg: string) => void;
}

const fm = (n: number) => 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const ItemModal: React.FC<ItemModalProps> = ({ onClose, onAdd, onToast }) => {
  const [desc, setDesc] = useState('');
  const [qtd, setQtd] = useState(1);
  const [valor, setValor] = useState('');

  const subtotal = qtd * (parseFloat(valor) || 0);

  const handleAdd = () => {
    if (!desc.trim()) return onToast('Informe a descrição!');
    const v = parseFloat(valor.replace(',', '.'));
    if (!v || v <= 0) return onToast('Informe o valor!');
    
    onAdd({ desc, qtd, valor: v });
    setDesc('');
    setQtd(1);
    setValor('');
  };

  return (
    <div className="overlay open" style={{ zIndex: 300 }}>
      <div className="modal" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <span className="modal-title">Adicionar item</span>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal-body">
          <Input label="Descrição *" placeholder="Ex: Instalação de tomada" value={desc} onChange={(e: any) => setDesc(e.target.value)} />
          <div className="row-2">
            <Input label="Quantidade" type="number" min="1" value={qtd} onChange={(e: any) => setQtd(Number(e.target.value) || 1)} />
            <Input label="Valor unitário (R$)" type="number" placeholder="0,00" min="0" step="0.01" value={valor} onChange={(e: any) => setValor(e.target.value)} />
          </div>
          <div className="total-box" style={{ marginTop: '10px' }}>
            <span className="total-label">Subtotal</span>
            <span className="total-value">{fm(subtotal)}</span>
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</Button>
          <Button style={{ flex: 2 }} onClick={handleAdd} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};
