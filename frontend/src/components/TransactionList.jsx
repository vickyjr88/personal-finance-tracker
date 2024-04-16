import React from "react";

function TransactionList({ transactions }) {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
      <ul className="space-y-4">
        {transactions.map((transaction, index) => (
          <li key={index} className="border border-gray-300 rounded-md p-4">
            <div>
              <span className="font-semibold">Amount: </span>
              {transaction.amount}
            </div>
            <div>
              <span className="font-semibold">Category: </span>
              {transaction.category}
            </div>
            <div>
              <span className="font-semibold">Type: </span>
              {transaction.type}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionList;
