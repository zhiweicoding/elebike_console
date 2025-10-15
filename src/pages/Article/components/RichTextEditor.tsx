import { Form, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImageToQiniu, dataURLtoFile } from '@/utils/qiniuUpload';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  name?: string;
  placeholder?: string;
  rules?: any[];
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  name,
  placeholder,
  rules,
}) => {
  const [editorValue, setEditorValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (value) {
      setEditorValue(value);
    }
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  // 工具栏图片上传处理
  const handleToolbarImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const hide = message.loading('图片上传中...', 0);
        const { url } = await uploadImageToQiniu(file);
        hide();

        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, 'image', url, 'user');
          quill.setSelection(index + 1, 0);
        }
        message.success('图片上传成功');
      } catch (error) {
        console.error('图片上传失败:', error);
        message.error('图片上传失败，请重试');
      } finally {
        setUploading(false);
        input.value = '';
      }
    };
    input.click();
  }, []);

  // 替换base64图片
  const replaceInlineBase64Images = useCallback(async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const imgs = Array.from(quill.root.querySelectorAll('img')) as HTMLImageElement[];
    const base64Images = imgs.filter((img) => img.src.startsWith('data:image/'));

    if (base64Images.length === 0) return;

    try {
      const hide = message.loading(`正在上传 ${base64Images.length} 张图片...`, 0);

      for (const img of base64Images) {
        try {
          const file = dataURLtoFile(img.src, 'pasted.png');
          const { url } = await uploadImageToQiniu(file);
          img.setAttribute('src', url);
        } catch (error) {
          console.error('替换base64图片失败:', error);
          // 保留base64，让用户手动处理
        }
      }

      hide();
      message.success('图片上传完成');
    } catch (error) {
      console.error('批量上传图片失败:', error);
    }
  }, []);

  // 配置工具栏
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image'], // 添加图片按钮
        ],
        handlers: {
          image: handleToolbarImage, // 自定义图片处理
        },
      },
    }),
    [handleToolbarImage],
  );

  // 处理粘贴事件：拦截图片粘贴并上传
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const root = quill.root;

    const handlePaste = async (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      if (!clipboard) return;

      const items = Array.from(clipboard.items);
      const imageItems = items.filter(
        (item) => item.kind === 'file' && item.type.indexOf('image/') === 0,
      );

      if (imageItems.length === 0) {
        // 粘贴后延迟检查是否有base64图片需要替换
        setTimeout(() => replaceInlineBase64Images(), 100);
        return;
      }

      // 阻止默认粘贴行为
      e.preventDefault();

      try {
        setUploading(true);
        const hide = message.loading('图片上传中...', 0);

        for (const item of imageItems) {
          const file = item.getAsFile();
          if (!file) continue;

          const { url } = await uploadImageToQiniu(file);
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, 'image', url, 'user');
          quill.setSelection(index + 1, 0);
        }

        hide();
        message.success('图片上传成功');
      } catch (error) {
        console.error('粘贴图片上传失败:', error);
        message.error('粘贴图片上传失败，请重试');
      } finally {
        setUploading(false);
      }
    };

    // 处理拖拽上传
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
        f.type.indexOf('image/') === 0,
      );

      if (files.length === 0) return;

      try {
        setUploading(true);
        const hide = message.loading('图片上传中...', 0);

        for (const file of files) {
          const { url } = await uploadImageToQiniu(file);
          const range = quill.getSelection(true);
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, 'image', url, 'user');
          quill.setSelection(index + 1, 0);
        }

        hide();
        message.success('图片上传成功');
      } catch (error) {
        console.error('拖拽图片上传失败:', error);
        message.error('拖拽图片上传失败，请重试');
      } finally {
        setUploading(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    root.addEventListener('paste', handlePaste as any);
    root.addEventListener('drop', handleDrop as any);
    root.addEventListener('dragover', handleDragOver as any);

    return () => {
      root.removeEventListener('paste', handlePaste as any);
      root.removeEventListener('drop', handleDrop as any);
      root.removeEventListener('dragover', handleDragOver as any);
    };
  }, [replaceInlineBase64Images]);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
    'color',
    'background',
  ];

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      valuePropName="value"
      getValueFromEvent={(content) => content}
      extra={uploading ? '图片上传中，请稍候...' : '支持工具栏选择、粘贴、拖拽上传图片'}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '200px', marginBottom: '50px' }}
        readOnly={uploading}
      />
    </Form.Item>
  );
};

export default RichTextEditor;
