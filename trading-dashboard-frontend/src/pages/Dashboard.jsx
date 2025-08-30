import SymbolSelector from "../components/SymbolSelector";
import TickDisplay from "../components/TickDisplay";
import OrderForm from "../components/OrderForm";
import OrdersTable from "../components/OrdersTable";

export default function Dashboard() {
  return (
    <div>
      <h1>Live Trading Dashboard</h1>
      <SymbolSelector />
      <TickDisplay />
      <OrderForm />
      <OrdersTable />
    </div>
  );
}
