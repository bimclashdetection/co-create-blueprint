import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RotateCcw, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Nomenclature = () => {
  const { toast } = useToast();
  const [prefix, setPrefix] = useState("TSK");
  const [separator, setSeparator] = useState("-");
  const [numberFormat, setNumberFormat] = useState("001");
  const [departmentCode, setDepartmentCode] = useState(true);

  const generatePreview = () => {
    const number = numberFormat === "001" ? "001" : "1";
    const dept = departmentCode ? "-ENG" : "";
    const sep = separator === "none" ? "" : separator;
    return `${prefix}${sep}${number}${dept}`;
  };

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Task ID nomenclature has been updated successfully.",
    });
  };

  const handleReset = () => {
    setPrefix("TSK");
    setSeparator("-");
    setNumberFormat("001");
    setDepartmentCode(true);
    toast({
      title: "Reset Complete",
      description: "Nomenclature settings have been reset to defaults.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Task ID Nomenclature</h1>
          <p className="text-muted-foreground mt-2">
            Configure how task IDs are generated and displayed across the system.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how your task IDs will appear with the current configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-6 bg-muted rounded-lg">
              <Hash className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground mb-1">Sample Task ID</div>
                <Badge variant="outline" className="text-2xl font-mono px-4 py-2">
                  {generatePreview()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Customize the format and structure of your task IDs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                  placeholder="TSK"
                  maxLength={5}
                />
                <p className="text-xs text-muted-foreground">
                  Short identifier for tasks (e.g., TSK, TASK, PRJ)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="separator">Separator</Label>
                <Select value={separator} onValueChange={setSeparator}>
                  <SelectTrigger id="separator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">Hyphen (-)</SelectItem>
                    <SelectItem value="_">Underscore (_)</SelectItem>
                    <SelectItem value=".">Period (.)</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Character between prefix and number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberFormat">Number Format</Label>
                <Select value={numberFormat} onValueChange={setNumberFormat}>
                  <SelectTrigger id="numberFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="001">Zero-padded (001, 002, 003)</SelectItem>
                    <SelectItem value="1">Sequential (1, 2, 3)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How task numbers are formatted
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentCode">Department Code</Label>
                <Select
                  value={departmentCode ? "enabled" : "disabled"}
                  onValueChange={(value) => setDepartmentCode(value === "enabled")}
                >
                  <SelectTrigger id="departmentCode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Include department code in task ID
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Nomenclature Rules</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Task IDs are automatically generated and cannot be manually edited</li>
                <li>• Each task ID is unique across the entire system</li>
                <li>• Department codes are 2-3 letter abbreviations (e.g., ENG, MKT, DES)</li>
                <li>• Changing the format only affects new tasks, existing IDs remain unchanged</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>Sample task IDs based on different departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Engineering Task</span>
                <Badge variant="outline" className="font-mono">
                  {prefix}{separator}{numberFormat === "001" ? "023" : "23"}{departmentCode ? "-ENG" : ""}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Marketing Task</span>
                <Badge variant="outline" className="font-mono">
                  {prefix}{separator}{numberFormat === "001" ? "045" : "45"}{departmentCode ? "-MKT" : ""}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Design Task</span>
                <Badge variant="outline" className="font-mono">
                  {prefix}{separator}{numberFormat === "001" ? "067" : "67"}{departmentCode ? "-DES" : ""}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Nomenclature;
