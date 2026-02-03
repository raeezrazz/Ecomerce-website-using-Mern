import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchItemTypes, createItemType, ItemType } from '@/api/adminApi';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItemTypeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function ItemTypeAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder = "LCD Digital Speedometer",
  className,
  error,
}: ItemTypeAutocompleteProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<ItemType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    if (!value || value.trim().length === 0) {
      setSuggestions([]);
      setShowAddButton(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchItemTypes(value.trim());
        setSuggestions(results);
        
        // Check if current value exactly matches any suggestion
        const exactMatch = results.some(
          item => item.name.toLowerCase() === value.trim().toLowerCase()
        );
        setShowAddButton(!exactMatch && value.trim().length > 0);
      } catch (error) {
        console.error('Error searching item types:', error);
        setSuggestions([]);
        setShowAddButton(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (itemName: string) => {
    onChange(itemName);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleAddToDatabase = async () => {
    if (!value || value.trim().length === 0) return;

    setAdding(true);
    try {
      await createItemType(value.trim());
      toast({
        title: 'Success',
        description: `"${value.trim()}" has been added to the database.`,
      });
      setShowAddButton(false);
      setShowSuggestions(false);
      // Refresh suggestions to include the new item
      const results = await searchItemTypes(value.trim());
      setSuggestions(results);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to add item type to database.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 || value.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(className, error && "border-red-500")}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || showAddButton) && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.length > 0 && (
            <div className="p-1">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
                  onClick={() => handleSelectSuggestion(item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
          
          {showAddButton && (
            <div className="border-t p-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleAddToDatabase}
                disabled={adding}
              >
                {adding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add "{value.trim()}" to database
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

