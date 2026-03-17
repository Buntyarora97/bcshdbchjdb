import React, { useState } from "react";
import { useBetAnalytics } from "@/hooks/use-analytics";
import { useMarkets } from "@/hooks/use-markets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const [marketId, setMarketId] = useState<number | undefined>(undefined);
  const { data: marketsData } = useMarkets();
  const { data, isLoading } = useBetAnalytics(marketId);

  const activeMarkets = marketsData?.markets?.filter(m => m.isActive) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Bet Analytics</h1>
          <p className="text-muted-foreground">Analyze exposure and liabilities per number.</p>
        </div>
        <div className="w-full sm:w-64">
          <select
            value={marketId || ""}
            onChange={(e) => setMarketId(e.target.value ? parseInt(e.target.value) : undefined)}
            className="flex h-12 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm text-foreground shadow-inner focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none"
          >
            <option value="">All Markets</option>
            {activeMarkets.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-secondary/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Collection</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(data?.totalCollected || 0)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-destructive/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(data?.totalPayout || 0)}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-emerald-900/30">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
              <h3 className={`text-2xl font-bold ${parseFloat(data?.netProfit || '0') >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(data?.netProfit || 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border/50 bg-secondary/10">
          <h3 className="text-lg font-bold text-white">Number Liabilities</h3>
          <p className="text-sm text-muted-foreground">Numbers with highest total bets placed.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Total Amount Placed</TableHead>
              <TableHead>Unique Users</TableHead>
              <TableHead>Potential Liability (90x)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10">Loading...</TableCell></TableRow>
            ) : !data?.analytics || data.analytics.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No bets placed yet</TableCell></TableRow>
            ) : (
              data.analytics.map((item: any, idx: number) => {
                const isHighRisk = idx < 3; // Highlight top 3
                return (
                  <TableRow key={item.number} className={isHighRisk ? "bg-red-500/5" : ""}>
                    <TableCell>
                      <span className={`font-display text-2xl font-bold ${isHighRisk ? 'text-destructive' : 'text-primary'}`}>
                        {item.number}
                      </span>
                      {isHighRisk && <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">High Risk</span>}
                    </TableCell>
                    <TableCell className="font-bold text-white text-lg">
                      {formatCurrency(item.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" /> {item.usersCount}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-red-400">
                      {formatCurrency(parseFloat(item.totalAmount) * 90)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
