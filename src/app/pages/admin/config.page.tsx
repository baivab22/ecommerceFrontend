import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from 'src/config';
import styled from 'styled-components';

const defaultConfig = {
  primaryColor: '#217fdb',
  secondaryColor: '#60afff',
  backgroundColor: '#fafafa',
  textColor: '#414142',
  logoUrl: '',
};

const Card = styled.div`
  max-width: 480px;
  margin: 56px auto;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 32px 0 rgba(0,0,0,0.10);
  padding: 48px 36px 36px 36px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  @media (max-width: 600px) {
    padding: 24px 8px;
    max-width: 98vw;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1a1a1a;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  font-size: 1.08rem;
  color: #6b7280;
  margin-bottom: 18px;
`;

const Field = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const Label = styled.label`
  min-width: 120px;
  font-weight: 600;
  color: #333;
  font-size: 1.05rem;
`;

const Helper = styled.span`
  font-size: 0.98rem;
  color: #8a8a8a;
  margin-left: 4px;
`;

const ColorInput = styled.input`
  width: 44px;
  height: 44px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: border 0.2s;
  &:focus {
    border: 2px solid #60afff;
  }
`;

const FileInput = styled.input`
  font-size: 1rem;
  padding: 6px 0;
  border: none;
  background: none;
`;

const LogoPreview = styled.img`
  height: 56px;
  border-radius: 10px;
  margin-left: 12px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
  background: #f8fafc;
`;

const SaveButton = styled.button`
  margin-top: 18px;
  padding: 14px 0;
  background: linear-gradient(90deg, #217fdb 0%, #60afff 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px 0 rgba(33,127,219,0.10);
  letter-spacing: 0.5px;
  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #60afff 0%, #217fdb 100%);
    box-shadow: 0 6px 24px 0 rgba(33,127,219,0.13);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function AdminConfigPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(BASE_URL + '/config').then(res => {
      setConfig({ ...defaultConfig, ...res.data });
    });
  }, []);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(logoFile);
    } else {
      setLogoPreview('');
    }
  }, [logoFile]);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    if (logoFile) {
      const formData = new FormData();
      formData.append('logo', logoFile);
      const logoRes = await axios.post(BASE_URL + '/logo', formData);
      config.logoUrl = logoRes.data.logoUrl;
    }
    await axios.post(BASE_URL + '/config', config);
    setSaving(false);
    setLogoFile(null);
    setLogoPreview('');
    alert('Config saved!');
  };

  return (
    <Card>
      <Title>Site Configuration</Title>
      <Subtitle>Manage your site's branding and color palette. Changes apply instantly across the admin and user site.</Subtitle>
      <Field>
        <Label htmlFor="primaryColor">Primary Color</Label>
        <ColorInput id="primaryColor" type="color" name="primaryColor" value={config.primaryColor} onChange={handleChange} />
        <Helper>Main accent for buttons and highlights.</Helper>
      </Field>
      <Field>
        <Label htmlFor="secondaryColor">Secondary Color</Label>
        <ColorInput id="secondaryColor" type="color" name="secondaryColor" value={config.secondaryColor} onChange={handleChange} />
        <Helper>Used for secondary actions and gradients.</Helper>
      </Field>
      <Field>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <ColorInput id="backgroundColor" type="color" name="backgroundColor" value={config.backgroundColor} onChange={handleChange} />
        <Helper>Page and card backgrounds.</Helper>
      </Field>
      <Field>
        <Label htmlFor="textColor">Text Color</Label>
        <ColorInput id="textColor" type="color" name="textColor" value={config.textColor} onChange={handleChange} />
        <Helper>Default text color for content.</Helper>
      </Field>
      <Field style={{alignItems: 'flex-start'}}>
        <Label htmlFor="logoUpload">Logo</Label>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <FileInput id="logoUpload" type="file" accept="image/*" onChange={handleLogoChange} />
          <Helper>Upload a PNG, JPG, or SVG logo. Transparent background recommended.</Helper>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, minHeight: 56}}>
            {logoPreview && (
              <LogoPreview src={logoPreview} alt="Preview" title="Preview (not saved yet)" style={{border: '2px dashed #60afff'}} />
            )}
            {!logoPreview && config.logoUrl && (
              <LogoPreview src={config.logoUrl} alt="Logo" />
            )}
          </div>
        </div>
      </Field>
      <SaveButton onClick={handleSave} disabled={saving}>
        {saving ? (
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
            <svg width="22" height="22" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.8s" repeatCount="indefinite"/></circle></svg>
            Saving...
          </span>
        ) : 'Save Config'}
      </SaveButton>
    </Card>
  );
}
