import { Card } from "./ui/card";
import React from "react";
import { CardTitle } from "./ui/card";
import { Activity, DollarSign, User, ShoppingCart } from "lucide-react";

export default function Tile({ name, developer, price, description }) {
  return (
    <div className="flex justify-center">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden w-2/3 m-5 p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
        <CardTitle className="text-slate-100 flex items-center text-xl font-semibold mb-3">
          <Activity className="mr-2 h-6 w-6 text-cyan-500" />
          {name}
        </CardTitle>
        <div className="text-slate-300">
          <p className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2 text-green-400" />
            <span className="font-medium">Developed by:</span> {developer}
          </p>
          <p className="mb-2">
            <span className="font-medium text-cyan-400">Description:</span> {description}
          </p>
          <p className="flex items-center text-lg font-semibold text-yellow-300 mb-4">
            <DollarSign className="h-5 w-5 mr-2" />
            ${price}
          </p>
          <button className="flex items-center justify-center bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-all duration-200">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy
          </button>
        </div>
      </Card>
    </div>
  );
}
