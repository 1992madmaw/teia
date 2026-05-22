import React, { useRef } from 'react';
import type { Empresa } from '../services/storage';
import { Card } from '../components/UI/Card';
import { Input, Select, Textarea } from '../components/UI/Input';
import { Button } from '../components/UI/Button';

interface CompanyPageProps {
  company: Empresa;
  logoB64: string | null;
  onSaveCompany: (emp: Empresa) => void;
  onSaveLogo: (logo: string) => void;
  onToast: (msg: string) => void;
}

export const CompanyPage: React.FC<CompanyPageProps> = ({ company, logoB64, onSaveCompany, onSaveLogo, onToast }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = React.useState<Empresa>({
    nome: company.nome || '',
    doc: company.doc || '',
    tel: company.tel || '',
    email: company.email || '',
    site: company.site || '',
    end: company.end || '',
    validade: company.validade || '15',
    pagamento: company.pagamento || 'A combinar',
    obs: company.obs || '',
  });

  const handleChange = (field: keyof Empresa, val: string) => {
    setFormData((prev: Empresa) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    onSaveCompany(formData);
    onToast('Empresa salva ✓');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result as string;
      onSaveLogo(res);
      onToast('Logo salva ✓');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page active" id="page-empresa">
      <div className="page-header">
        <div>
          <h1 className="page-title">Minha Empresa</h1>
          <p className="page-sub">Essas informações aparecem em todos os seus orçamentos</p>
        </div>
        <Button size="lg" onClick={handleSave} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}>
          Salvar
        </Button>
      </div>

      <Card title="Logo">
        <div className="logo-upload" onClick={() => fileInputRef.current?.click()}>
          {logoB64 ? (
            <>
              <img src={logoB64} alt="Logo" />
              <p style={{ color: 'var(--text2)', fontSize: '.8rem' }}>Clique para trocar</p>
            </>
          ) : (
            <>
              <div className="logo-upload-icon">🏢</div>
              <p>Clique para adicionar sua logo</p>
              <small>PNG ou JPG</small>
            </>
          )}
        </div>
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
      </Card>

      <Card title="Dados cadastrais">
        <Input label="Nome / Razão Social *" placeholder="Ex: João Silva Eletricista" value={formData.nome} onChange={(e: any) => handleChange('nome', e.target.value)} />
        <div className="row-2">
          <Input label="CPF / CNPJ" placeholder="000.000.000-00" value={formData.doc} onChange={(e: any) => handleChange('doc', e.target.value)} />
          <Input label="Telefone / WhatsApp" type="tel" placeholder="(11) 99999-9999" value={formData.tel} onChange={(e: any) => handleChange('tel', e.target.value)} />
        </div>
        <div className="row-2">
          <Input label="E-mail" type="email" placeholder="contato@empresa.com" value={formData.email} onChange={(e: any) => handleChange('email', e.target.value)} />
          <Input label="Site (opcional)" placeholder="www.suaempresa.com.br" value={formData.site} onChange={(e: any) => handleChange('site', e.target.value)} />
        </div>
        <Input label="Endereço" placeholder="Rua, número, bairro, cidade – UF" value={formData.end} onChange={(e: any) => handleChange('end', e.target.value)} />
      </Card>

      <Card title="Padrões de orçamento">
        <div className="row-2">
          <Select label="Validade padrão" value={formData.validade} onChange={(e: any) => handleChange('validade', e.target.value)}>
            <option value="7">7 dias</option>
            <option value="15">15 dias</option>
            <option value="30">30 dias</option>
            <option value="60">60 dias</option>
          </Select>
          <Select label="Pagamento padrão" value={formData.pagamento} onChange={(e: any) => handleChange('pagamento', e.target.value)}>
            <option value="A combinar">A combinar</option>
            <option value="À vista">À vista</option>
            <option value="Pix">Pix</option>
            <option value="50% entrada + 50% conclusão">50% + 50%</option>
          </Select>
        </div>
        <Textarea label="Observação padrão" placeholder="Ex: Garantia de 90 dias na mão de obra." value={formData.obs} onChange={(e: any) => handleChange('obs', e.target.value)} />
      </Card>
    </div>
  );
};
