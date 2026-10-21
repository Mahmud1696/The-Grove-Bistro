import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ChefHat, 
  Building2, 
  Truck, 
  ShoppingBasket,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface KitchenDisplayTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onNotification: (msg: string) => void;
}

export function KitchenDisplayTab({
  orders,
  onUpdateOrderStatus,
  onNotification
}: KitchenDisplayTabProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [filterChannel, setFilterChannel] = useState<'all' | 'dine-in' | 'delivery' | 'pickup'>('all');

  // Update timer every 30 seconds for live order age calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio chime generator
  const playKitchenChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // Audio not permitted without user gesture or unsupported
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Filter orders by channel if selected
  const channelFilteredOrders = useMemo(() => {
    if (filterChannel === 'all') return orders;
    return orders.filter(o => o.orderType === filterChannel);
  }, [orders, filterChannel]);

  // Organize orders into 4 KDS columns:
  // 1. New (Pending / Confirmed)
  // 2. Preparing
  // 3. Ready
  // 4. Completed (Recently completed, max 5)
  const newOrders = channelFilteredOrders.filter(o => ['Pending', 'Confirmed'].includes(o.orderStatus));
  const preparingOrders = channelFilteredOrders.filter(o => o.orderStatus === 'Preparing');
  const readyOrders = channelFilteredOrders.filter(o => o.orderStatus === 'Ready');
  const completedOrders = channelFilteredOrders.filter(o => o.orderStatus === 'Completed').slice(0, 5);

  const getOrderAgeMinutes = (createdAt: string) => {
    const diffMs = currentTime - new Date(createdAt).getTime();
    return Math.max(1, Math.floor(diffMs / 60000));
  };

  const handleAdvance = (orderId: string, nextStatus: OrderStatus) => {
    playKitchenChime();
    onUpdateOrderStatus(orderId, nextStatus);
    onNotification(`Kitchen: Ticket #${orderId} bumped to ${nextStatus}.`);
  };

  return (
    <div className={`space-y-4 select-none ${isFullscreen ? 'p-4 bg-stone-900 min-h-screen text-white' : ''}`}>
      {/* KDS Control Header */}
      <div className="bg-white border border-stone-200 p-3 sm:p-4 rounded-md shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#1B3B2B] text-white flex items-center justify-center shadow-xs">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="font-serif-display text-sm sm:text-base font-bold text-stone-900 leading-tight">
              Live Kitchen Display System (KDS)
            </h3>
            <p className="text-[11px] text-stone-500">
              {newOrders.length + preparingOrders.length} active orders on the kitchen line
            </p>
          </div>
        </div>

        {/* Secondary Controls: Channel Filter + Sound + Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Channel selector */}
          <div className="inline-flex items-center p-1 bg-stone-100 rounded-sm border border-stone-200">
            <button
              onClick={() => setFilterChannel('all')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                filterChannel === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterChannel('dine-in')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                filterChannel === 'dine-in' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Dine-In
            </button>
            <button
              onClick={() => setFilterChannel('delivery')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                filterChannel === 'delivery' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              Delivery
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-sm border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-100 text-stone-500 border-stone-300'
            }`}
            title={soundEnabled ? 'Kitchen chime on bump: Enabled' : 'Kitchen chime: Muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen KDS'}</span>
          </button>
        </div>
      </div>

      {/* 4 KDS Ticket Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Column 1: NEW ORDERS */}
        <div className="bg-stone-100/80 rounded-md border border-stone-200/80 flex flex-col max-h-[calc(100vh-230px)] overflow-hidden">
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">
                1. New Orders
              </h4>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-500 text-stone-950 rounded-full">
              {newOrders.length}
            </span>
          </div>

          <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
            {newOrders.length > 0 ? (
              newOrders.map(order => {
                const age = getOrderAgeMinutes(order.createdAt);
                const isOverdue = age > 20;

                return (
                  <div 
                    key={order.orderId}
                    className={`bg-white rounded-sm border p-3 shadow-2xs space-y-2.5 transition-all ${
                      isOverdue ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-stone-200'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-sm font-bold text-stone-900 block">
                          #{order.orderId}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-700">
                          {order.customerName}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className={`flex items-center gap-1 font-mono text-xs font-bold ${
                          isOverdue ? 'text-amber-700 animate-pulse' : 'text-stone-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{age}m</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block mt-0.5">
                          {order.orderType}
                        </span>
                      </div>
                    </div>

                    {order.tableReference && (
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                        Dine-In: {order.tableReference}
                      </div>
                    )}

                    {/* Items List */}
                    <div className="divide-y divide-stone-100 border-t border-b border-stone-100 py-1 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs pt-1">
                          <div className="flex items-start gap-2">
                            <span className="font-mono font-bold text-stone-950 text-sm bg-stone-100 px-1.5 rounded-xs">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-stone-900 leading-tight">
                              {it.item.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <div className="bg-amber-50 p-1.5 rounded-xs border border-amber-200 text-[11px] text-amber-900">
                        <strong>Note:</strong> {order.specialInstructions}
                      </div>
                    )}

                    {/* Touch Action Button */}
                    <button
                      type="button"
                      onClick={() => handleAdvance(order.orderId, 'Preparing')}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Start Prep</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-stone-400">
                No tickets waiting
              </div>
            )}
          </div>
        </div>

        {/* Column 2: PREPARING (Cooking / On the line) */}
        <div className="bg-stone-100/80 rounded-md border border-stone-200/80 flex flex-col max-h-[calc(100vh-230px)] overflow-hidden">
          <div className="p-3 bg-orange-500/10 border-b border-orange-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-orange-950">
                2. In Prep (Line)
              </h4>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-orange-600 text-white rounded-full">
              {preparingOrders.length}
            </span>
          </div>

          <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
            {preparingOrders.length > 0 ? (
              preparingOrders.map(order => {
                const age = getOrderAgeMinutes(order.createdAt);
                const isOverdue = age > 25;

                return (
                  <div 
                    key={order.orderId}
                    className={`bg-white rounded-sm border p-3 shadow-2xs space-y-2.5 transition-all ${
                      isOverdue ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-orange-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-sm font-bold text-stone-900 block">
                          #{order.orderId}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-700">
                          {order.customerName}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className={`flex items-center gap-1 font-mono text-xs font-bold ${
                          isOverdue ? 'text-rose-700 animate-pulse' : 'text-orange-800'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{age}m</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block mt-0.5">
                          {order.orderType}
                        </span>
                      </div>
                    </div>

                    {order.tableReference && (
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs">
                        Dine-In: {order.tableReference}
                      </div>
                    )}

                    <div className="divide-y divide-stone-100 border-t border-b border-stone-100 py-1 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs pt-1">
                          <div className="flex items-start gap-2">
                            <span className="font-mono font-bold text-stone-950 text-sm bg-stone-100 px-1.5 rounded-xs">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-stone-900 leading-tight">
                              {it.item.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <div className="bg-amber-50 p-1.5 rounded-xs border border-amber-200 text-[11px] text-amber-900">
                        <strong>Note:</strong> {order.specialInstructions}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAdvance(order.orderId, 'Ready')}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Ready (Plated)</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-stone-400">
                No tickets actively cooking
              </div>
            )}
          </div>
        </div>

        {/* Column 3: READY (Plated / For Dispatch) */}
        <div className="bg-stone-100/80 rounded-md border border-stone-200/80 flex flex-col max-h-[calc(100vh-230px)] overflow-hidden">
          <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                3. Ready / Plated
              </h4>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-700 text-white rounded-full">
              {readyOrders.length}
            </span>
          </div>

          <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => {
                const age = getOrderAgeMinutes(order.createdAt);

                return (
                  <div 
                    key={order.orderId}
                    className="bg-white rounded-sm border border-emerald-300 p-3 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-sm font-bold text-stone-900 block">
                          #{order.orderId}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-700">
                          {order.customerName}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-emerald-800 font-mono text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Ready</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-stone-400 block mt-0.5">
                          {order.orderType}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-600">
                      {order.items.map(it => `${it.quantity}x ${it.item.name}`).join(', ')}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdvance(order.orderId, order.orderType === 'delivery' ? 'Out for delivery' : 'Completed')}
                      className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>{order.orderType === 'delivery' ? 'Dispatch Courier' : 'Serve / Complete'}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-stone-400">
                No orders waiting on pass
              </div>
            )}
          </div>
        </div>

        {/* Column 4: RECENTLY COMPLETED */}
        <div className="bg-stone-100/80 rounded-md border border-stone-200/80 flex flex-col max-h-[calc(100vh-230px)] overflow-hidden">
          <div className="p-3 bg-stone-200/60 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                4. Bumped / Cleared
              </h4>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-300 text-stone-800 rounded-full">
              {completedOrders.length}
            </span>
          </div>

          <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => (
                <div 
                  key={order.orderId}
                  className="bg-white/80 rounded-sm border border-stone-200 p-2.5 shadow-2xs space-y-1.5 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-stone-700">#{order.orderId}</span>
                    <span className="text-[10px] text-stone-400 capitalize">{order.orderType}</span>
                  </div>
                  <div className="text-[11px] text-stone-600 truncate">
                    {order.customerName} · {order.items.length} items
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdvance(order.orderId, 'Ready')}
                    className="w-full py-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-xs border border-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    title="Recall ticket back to pass"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Recall Ticket</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-stone-400">
                No recent cleared tickets
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
