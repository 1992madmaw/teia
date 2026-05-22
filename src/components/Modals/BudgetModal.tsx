import React, { useState, useEffect } from 'react';
import type { Budget, BudgetItem, Empresa } from '../../services/storage';
import { generatePDF } from '../../services/pdfGenerator';
import { Input, Select, Textarea } from '../UI/Input';
import { Button } from '../UI/Button';
import { ItemModal } from './ItemModal';

interface BudgetModalProps {
  budget: Partial<Budget> | null;
  empresa: Empresa;
  logoB64: string | null;
  onClose: () => void;
  onSave: (data: Partial<Budget>) => void;
  onToast: (msg: string) => void;
}

const fm = (n: number) => 'R$ ' + (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const BudgetModal: React.FC<BudgetModalProps> = ({ budget, empresa, logoB64, onClose, onSave, onToast }) => {
  const [showItemModal, setShowItemModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Budget>>({
    cliente: '',
    telCliente: '',
    local: '',
    pagamento: empresa.pagamento || 'A combinar',
    prazo: '',
    obs: empresa.obs || '',
    items: []
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        ...formData,
        ...budget,
        items: budget.items ? [...budget.items] : []
      });
    }
  }, [budget]);

  const total = formData.items?.reduce((s, i) => s + i.qtd * i.valor, 0) || 0;

  const handleChange = (f: keyof Budget, val: any) => {
    setFormData(prev => ({ ...prev, [f]: val }));
  };

  const handleAddItem = (item: BudgetItem) => {
    setFormData(prev => ({ ...prev, items: [...(prev.items || []), item] }));
    setShowItemModal(false);
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => {
      const newItems = [...(prev.items || [])];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleSave = () => {
    if (!formData.cliente) return onToast('Informe o nome do cliente!');
    if (!formData.items?.length) return onToast('Adicione ao menos um item!');
    onSave({ ...formData, total });
    onToast('Orçamento salvo ✓');
  };

  const handleGerarPDF = () => {
    if (!formData.cliente) return onToast('Informe o nome do cliente!');
    if (!formData.items?.length) return onToast('Adicione ao menos um item!');
    if (!empresa.nome) return onToast('Configure os dados da empresa primeiro!');
    
    onSave({ ...formData, total });
    
    const budgetData = {
      ...budget,
      ...formData,
      total,
      items: formData.items || [],
      numero: budget?.numero || '001',
      data: budget?.data || new Date().toLocaleDateString('pt-BR')
    } as Budget;

    generatePDF(budgetData, empresa, logoB64);
    onToast('PDF gerado ✓');
  };

  return (
    <>
      <div className="overlay open">
        <div className="modal">
          <div className="modal-header">
            <span className="modal-title">{budget?.id ? `Orçamento #${budget?.numero}` : 'Novo Orçamento'}</span>
            <button className="modal-close" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-section">
              <div className="modal-section-title">Cliente</div>
              <Input label="Nome do cliente *" placeholder="Nome completo" value={formData.cliente} onChange={(e: any) => handleChange('cliente', e.target.value)} />
              <div className="row-2">
                <Input label="Telefone" type="tel" placeholder="(11) 99999-9999" value={formData.telCliente} onChange={(e: any) => handleChange('telCliente', e.target.value)} />
                <Input label="Local do serviço" placeholder="Endereço ou referência" value={formData.local} onChange={(e: any) => handleChange('local', e.target.value)} />
              </div>
            </div>
            
            <div className="modal-section">
              <div className="modal-section-title">Serviços e Produtos</div>
              <div id="items-list">
                {formData.items && formData.items.length > 0 ? (
                  formData.items.map((it, i) => (
                    <div className="item-row" key={i}>
                      <div className="item-info">
                        <div className="item-desc">{it.desc}</div>
                        <div className="item-meta">{it.qtd}x {fm(it.valor)}</div>
                      </div>
                      <div className="item-total">{fm(it.qtd * it.valor)}</div>
                      <button className="item-del" onClick={() => handleRemoveItem(i)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text3)', fontSize: '.84rem', padding: '8px 0' }}>Nenhum item adicionado.</p>
                )}
              </div>
              <Button variant="secondary" fullWidth style={{ marginTop: '10px' }} onClick={() => setShowItemModal(true)} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
                Adicionar item
              </Button>
              <div className="total-box">
                <span className="total-label">Total</span>
                <span className="total-value">{fm(total)}</span>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-title">Condições</div>
              <div className="row-2">
                <Select label="Forma de pagamento" value={formData.pagamento} onChange={(e: any) => handleChange('pagamento', e.target.value)}>
                  <option>A combinar</option>
                  <option>À vista</option>
                  <option>Pix</option>
                  <option>Cartão de crédito</option>
                  <option>Boleto</option>
                  <option value="50% entrada + 50% conclusão">50% entrada + 50%</option>
                </Select>
                <Input label="Prazo de execução" placeholder="Ex: 3 dias úteis" value={formData.prazo} onChange={(e: any) => handleChange('prazo', e.target.value)} />
              </div>
              <Textarea label="Observações" placeholder="Garantia, detalhes adicionais..." value={formData.obs} onChange={(e: any) => handleChange('obs', e.target.value)} />
            </div>
          </div>
          
          <div className="modal-footer">
            <Button variant="secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</Button>
            <Button variant="secondary" style={{ flex: 1 }} onClick={handleSave} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}>
              Salvar
            </Button>
            <Button style={{ flex: 2 }} onClick={handleGerarPDF} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>}>
              Gerar PDF
            </Button>
          </div>
        </div>
      </div>
      
      {showItemModal && (
        <ItemModal onClose={() => setShowItemModal(false)} onAdd={handleAddItem} onToast={onToast} />
      )}
    </>
  );
};
