import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter,
  Quote,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCallback, useState } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TipTapEditor({ content, onChange, placeholder = 'Write something...' }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [colorValue, setColorValue] = useState('#000000');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Highlight,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleLinkSubmit = useCallback(() => {
    if (!editor || !linkUrl) return;

    // Check if text is selected
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleImageSubmit = useCallback(() => {
    if (!editor || !imageUrl) return;
    
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt })
      .run();
    
    setImageUrl('');
    setImageAlt('');
  }, [editor, imageUrl, imageAlt]);

  const handleColorSubmit = useCallback(() => {
    if (!editor) return;
    
    editor
      .chain()
      .focus()
      .setColor(colorValue)
      .run();
  }, [editor, colorValue]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md p-4">
      <div className="border-b pb-2 mb-4 flex flex-wrap gap-1">
        {/* Text formatting */}
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        {/* Text alignment */}
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'left' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          aria-label="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'center' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          aria-label="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'right' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          aria-label="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: 'justify' })}
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
          aria-label="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>

        {/* Headings */}
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        {/* Lists */}
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        {/* Blockquote */}
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        {/* Link */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 ${editor.isActive('link') ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Insert Link</h4>
                <p className="text-sm text-muted-foreground">
                  Add a URL to create a link
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link-url">URL</Label>
                <Input 
                  id="link-url" 
                  placeholder="https://example.com" 
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleLinkSubmit}
                  className="w-full"
                >
                  Save Link
                </Button>
                {editor.isActive('link') && (
                  <Button 
                    variant="outline"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Insert Image</h4>
                <p className="text-sm text-muted-foreground">
                  Add an image URL
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input 
                  id="image-url" 
                  placeholder="https://example.com/image.jpg" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input 
                  id="image-alt" 
                  placeholder="Image description" 
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <Button onClick={handleImageSubmit}>Insert Image</Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Table */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          onClick={insertTable}
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        {/* Highlight */}
        <Toggle
          size="sm"
          pressed={editor.isActive('highlight')}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          aria-label="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Toggle>

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Text Color</h4>
                <p className="text-sm text-muted-foreground">
                  Choose a color for selected text
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color-picker">Select Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="color-picker" 
                    type="color"
                    value={colorValue}
                    onChange={(e) => setColorValue(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm">{colorValue}</span>
                </div>
              </div>
              <Button onClick={handleColorSubmit}>Apply Color</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <EditorContent editor={editor} className="prose max-w-none min-h-[200px]" />
    </div>
  );
}