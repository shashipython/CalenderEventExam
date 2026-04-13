import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: string;
}

export function ReimbursementForm() {
  const [claimDate, setClaimDate] = useState<Date>();
  const [claimTo, setClaimTo] = useState("");
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "1", category: "", description: "", amount: "" }
  ]);

  const expenseCategories = [
    "Travel",
    "Meals",
    "Accommodation",
    "Office Supplies",
    "Equipment",
    "Transportation",
    "Client Entertainment",
    "Other"
  ];

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), category: "", description: "", amount: "" }]);
  };

  const removeExpense = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const calculateTotal = () => {
    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return total + amount;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      claimDate,
      claimTo,
      expenses,
      total: calculateTotal()
    });
    alert("Reimbursement claim submitted successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reimbursement Claim Form</CardTitle>
        <CardDescription>Fill in the details of your expenses below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Claim Date */}
          <div className="space-y-2">
            <Label htmlFor="claim-date">Claim Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="claim-date"
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {claimDate ? format(claimDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={claimDate}
                  onSelect={setClaimDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Who You're Claiming */}
          <div className="space-y-2">
            <Label htmlFor="claim-to">To Who You're Claiming</Label>
            <Input
              id="claim-to"
              placeholder="e.g., Finance Department, Manager Name"
              value={claimTo}
              onChange={(e) => setClaimTo(e.target.value)}
              required
            />
          </div>

          {/* Expenses Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Expense Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExpense}>
                <Plus className="h-4 w-4 mr-1" />
                Add Expense
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Expense Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[140px]">Amount</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <Select
                          value={expense.category}
                          onValueChange={(value) => updateExpense(expense.id, "category", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          placeholder="Describe the expense..."
                          value={expense.description}
                          onChange={(e) => updateExpense(expense.id, "description", e.target.value)}
                          required
                          rows={1}
                          className="min-h-[40px] resize-none"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={expense.amount}
                            onChange={(e) => updateExpense(expense.id, "amount", e.target.value)}
                            className="pl-7"
                            required
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {expenses.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-lg">
            <span>Total Amount</span>
            <span className="text-2xl">${calculateTotal().toFixed(2)}</span>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Submit Reimbursement Claim
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}