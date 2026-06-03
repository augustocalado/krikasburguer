-- 1. Adicionar coluna sort_order (se não existir)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- 2. Criar Bucket de Storage 'products' se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas para o Bucket 'products'
-- O Supabase Storage usa a tabela 'storage.objects' para permissões

-- Todos podem ver as fotos (Select)
CREATE POLICY "Imagens visíveis para todos" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Apenas o Admin pode fazer Upload de imagens (Insert)
CREATE POLICY "Admin pode enviar imagens" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND 
    auth.jwt() ->> 'email' = 'augustocalado22@gmail.com'
  );

-- Apenas o Admin pode Atualizar imagens
CREATE POLICY "Admin pode modificar imagens" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' AND 
    auth.jwt() ->> 'email' = 'augustocalado22@gmail.com'
  );

-- Apenas o Admin pode Deletar imagens
CREATE POLICY "Admin pode deletar imagens" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND 
    auth.jwt() ->> 'email' = 'augustocalado22@gmail.com'
  );
