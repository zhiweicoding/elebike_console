import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link'],
    ],
  };

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
    >
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: '200px', marginBottom: '50px' }}
      />
    </Form.Item>
  );
};

export default RichTextEditor;
