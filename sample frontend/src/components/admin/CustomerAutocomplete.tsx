import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { searchCustomers, createCustomer, type Customer } from '@/api/adminApi';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerAutocompleteProps {
  customerName: string;
  phone: string;
  onCustomerNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  nameError?: string;
  phoneError?: string;
  namePlaceholder?: string;
  phonePlaceholder?: string;
}

export function CustomerAutocomplete({
  customerName,
  phone,
  onCustomerNameChange,
  onPhoneChange,
  nameError,
  phoneError,
  namePlaceholder = 'John Doe',
  phonePlaceholder = '9876543210',
}: CustomerAutocompleteProps) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const phoneDigits = phone.replace(/\D/g, '');
  const hasValidName = customerName.trim().length > 0;
  const hasValidPhone = phoneDigits.length === 10;
  const canAdd = hasValidName && hasValidPhone;
  const exactMatch = canAdd && suggestions.some(
    (c) =>
      c.name.toLowerCase() === customerName.trim().toLowerCase() &&
      c.phone.replace(/\D/g, '') === phoneDigits
  );
  const showAddInDropdown = canAdd && !exactMatch;

  // Debounce search (same as ItemTypeAutocomplete)
  useEffect(() => {
    if (!customerName || customerName.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchCustomers(customerName.trim());
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [customerName]);

  // Close suggestions when clicking outside (same as ItemTypeAutocomplete)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomerNameChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = (c: Customer) => {
    onCustomerNameChange(c.name);
    onPhoneChange(c.phone);
    setShowSuggestions(false);
    nameInputRef.current?.blur();
  };

  const handleAddToDatabase = async () => {
    const trimmedName = customerName.trim();
    if (!trimmedName || phoneDigits.length !== 10) {
      toast({
        title: 'Invalid',
        description: 'Enter both name and a 10-digit phone number to save.',
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);
    try {
      await createCustomer(trimmedName, phone.trim());
      toast({
        title: 'Success',
        description: `"${trimmedName}" has been added to the database. Select from suggestions next time.`,
      });
      setShowSuggestions(false);
      const results = await searchCustomers(trimmedName);
      setSuggestions(results);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Failed to add customer to database.';
      toast({
        title: 'Error',
        description: String(msg),
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  const handleNameFocus = () => {
    if (suggestions.length > 0 || customerName.trim().length > 0 || showAddInDropdown) {
      setShowSuggestions(true);
    }
  };

  // When user fills both name + phone, show dropdown so "Add to database" is visible (like item type)
  useEffect(() => {
    if (showAddInDropdown) {
      setShowSuggestions(true);
    }
  }, [showAddInDropdown]);

  // Same logic as ItemTypeAutocomplete: show dropdown when there are suggestions OR when we can add
  const showDropdown = showSuggestions && (suggestions.length > 0 || showAddInDropdown);

  return (
    <div ref={wrapperRef} className="space-y-3">
      {/* Row: Customer Name + Phone fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <div className="relative">
            <Input
              ref={nameInputRef}
              id="customerName"
              value={customerName}
              onChange={handleNameChange}
              onFocus={handleNameFocus}
              placeholder={namePlaceholder}
              className={cn(nameError && 'border-red-500')}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="min-h-5 flex items-center">Phone *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onFocus={() => {
              if (showAddInDropdown) setShowSuggestions(true);
            }}
            placeholder={phonePlaceholder}
            className={cn(phoneError && 'border-red-500')}
          />
          {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
        </div>
      </div>

      {/* Suggestions + Add to database — below the fields, no overlap */}
      {showDropdown && (
        <div className="rounded-md border bg-popover shadow-sm overflow-hidden">
          {suggestions.length > 0 && (
            <div className="p-1 max-h-48 overflow-auto">
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
                  onClick={() => handleSelect(c)}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground ml-1">— {c.phone}</span>
                </button>
              ))}
            </div>
          )}

          {showAddInDropdown && (
            <div className="border-t bg-muted/30 p-2">
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
                    Add &quot;{customerName.trim()}&quot; + phone to database
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

