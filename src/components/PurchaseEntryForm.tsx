import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PurchaseEntry, AssetType } from '../types/investment';
import { validatePurchaseQuantity } from '../utils/investmentCalculator';

interface PurchaseEntryFormProps {
  assetType: AssetType;
  purchases: PurchaseEntry[];
  onPurchasesChange: (purchases: PurchaseEntry[]) => void;
}

const PurchaseEntryForm: React.FC<PurchaseEntryFormProps> = ({
  assetType,
  purchases,
  onPurchasesChange,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addPurchase = () => {
    const newPurchase: PurchaseEntry = {
      id: Date.now().toString(),
      purchaseTime: 0,
      price: 0,
      quantity: 0,
    };
    onPurchasesChange([...purchases, newPurchase]);
  };

  const removePurchase = (id: string) => {
    onPurchasesChange(purchases.filter(p => p.id !== id));
  };

  const updatePurchase = (id: string, field: keyof PurchaseEntry, value: string | number) => {
    const updatedPurchases = purchases.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onPurchasesChange(updatedPurchases);

    // 수량 유효성 검사
    if (field === 'quantity') {
      const newErrors = { ...errors };
      if (typeof value === 'string') {
        if (!validatePurchaseQuantity(assetType, value)) {
          newErrors[`${id}-quantity`] = assetType === 'crypto' 
            ? '양수의 숫자를 입력해주세요 (소수점 허용)'
            : '양의 정수를 입력해주세요';
        } else {
          delete newErrors[`${id}-quantity`];
        }
      }
      setErrors(newErrors);
    }
  };

  const getAssetTypeName = (type: AssetType): string => {
    const names = {
      stock: '주식',
      crypto: '암호화폐',
      'real-estate': '부동산',
      bond: '채권',
      fund: '펀드'
    };
    return names[type];
  };

  const getQuantityLabel = (type: AssetType): string => {
    const labels = {
      stock: '주식 수',
      crypto: '코인 수량',
      'real-estate': '보유 수량',
      bond: '채권 수',
      fund: '좌수'
    };
    return labels[type];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          분할 매수 내역 ({getAssetTypeName(assetType)})
        </h3>
        <button
          onClick={addPurchase}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          매수 추가
        </button>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          매수 내역을 추가해주세요
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매수 시점 (개월)
                </label>
                <input
                  type="number"
                  min="0"
                  value={purchase.purchaseTime}
                  onChange={(e) => updatePurchase(purchase.id, 'purchaseTime', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매수 가격 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  value={purchase.price}
                  onChange={(e) => updatePurchase(purchase.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getQuantityLabel(assetType)}
                </label>
                <input
                  type="number"
                  min="0"
                  step={assetType === 'crypto' ? '0.000001' : '1'}
                  value={purchase.quantity}
                  onChange={(e) => updatePurchase(purchase.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[`${purchase.id}-quantity`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors[`${purchase.id}-quantity`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`${purchase.id}-quantity`]}</p>
                )}
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => removePurchase(purchase.id)}
                  className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {purchases.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">총 투자 금액</h4>
          <p className="text-2xl font-bold text-blue-900">
            {new Intl.NumberFormat('ko-KR', {
              style: 'currency',
              currency: 'KRW',
              minimumFractionDigits: 0,
            }).format(
              purchases.reduce((sum, p) => sum + (p.price * p.quantity), 0)
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchaseEntryForm;