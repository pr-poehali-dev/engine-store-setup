import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';

type Engine = {
  id: number;
  name: string;
  price: number;
};

export default function Checkout() {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLegalEntity, setIsLegalEntity] = useState(false);

  const cart: Engine[] = JSON.parse(localStorage.getItem('cart') || '[]');
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const deliveryCosts: Record<string, number> = {
    courier: 2000,
    transport: 5000,
    pickup: 0,
  };

  const deliveryLabels: Record<string, string> = {
    courier: 'Курьерская доставка',
    transport: 'Транспортная компания',
    pickup: 'Самовывоз',
  };

  const deliveryCost = deliveryCosts[deliveryMethod];
  const total = subtotal + deliveryCost;

  const { login } = useUserAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;

    const orderData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      customer: {
        name,
        phone,
        email,
        isCompany: isLegalEntity,
        inn: isLegalEntity ? formData.get('inn') : undefined,
        companyName: isLegalEntity ? formData.get('companyName') : undefined,
      },
      delivery: {
        method: deliveryLabels[deliveryMethod],
        address: deliveryMethod !== 'pickup' ? formData.get('address') : undefined,
        cost: deliveryCost,
      },
      payment: formData.get('payment'),
      items: cart,
      total: total,
      status: 'new',
      comment: formData.get('comment'),
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, orderData]));
    
    login(phone, name, email);
    
    alert('Заказ успешно оформлен! Наш менеджер свяжется с вами в ближайшее время.');
    localStorage.removeItem('cart');
    navigate('/account');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
            <p className="text-muted-foreground mb-6">Добавьте товары в корзину для оформления заказа</p>
            <Button onClick={() => navigate('/')}>Перейти в каталог</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Settings" size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary font-['Montserrat']">ПромДвигатель</h1>
              <p className="text-sm text-muted-foreground">Профессиональные решения</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Вернуться в каталог
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 font-['Montserrat']">Оформление заказа</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="User" size={24} />
                      Контактная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Checkbox
                        id="legal-entity"
                        checked={isLegalEntity}
                        onCheckedChange={(checked) => setIsLegalEntity(checked as boolean)}
                      />
                      <label htmlFor="legal-entity" className="text-sm font-medium cursor-pointer">
                        Я представляю юридическое лицо
                      </label>
                    </div>

                    {isLegalEntity && (
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <Label htmlFor="company-name">Название компании *</Label>
                          <Input id="company-name" required placeholder="ООО «Рога и копыта»" />
                        </div>
                        <div>
                          <Label htmlFor="inn">ИНН *</Label>
                          <Input id="inn" required placeholder="1234567890" />
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name">Имя *</Label>
                        <Input id="first-name" required placeholder="Иван" />
                      </div>
                      <div>
                        <Label htmlFor="last-name">Фамилия *</Label>
                        <Input id="last-name" required placeholder="Иванов" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input id="phone" type="tel" required placeholder="+7 (999) 123-45-67" />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required placeholder="example@email.com" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Truck" size={24} />
                      Способ доставки
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="courier" id="courier" />
                          <label htmlFor="courier" className="cursor-pointer flex-1">
                            <p className="font-semibold">Курьерская доставка</p>
                            <p className="text-sm text-muted-foreground">По Москве и области, 2-3 дня</p>
                          </label>
                        </div>
                        <span className="font-bold">2 000 ₽</span>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="transport" id="transport" />
                          <label htmlFor="transport" className="cursor-pointer flex-1">
                            <p className="font-semibold">Транспортная компания</p>
                            <p className="text-sm text-muted-foreground">По всей России, 5-10 дней</p>
                          </label>
                        </div>
                        <span className="font-bold">5 000 ₽</span>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <label htmlFor="pickup" className="cursor-pointer flex-1">
                            <p className="font-semibold">Самовывоз</p>
                            <p className="text-sm text-muted-foreground">
                              г. Москва, ул. Промышленная, д. 15
                            </p>
                          </label>
                        </div>
                        <span className="font-bold text-green-600">Бесплатно</span>
                      </div>
                    </RadioGroup>

                    {deliveryMethod !== 'pickup' && (
                      <div className="mt-6 space-y-4">
                        <Separator />
                        <h3 className="font-semibold">Адрес доставки</h3>
                        <div className="grid gap-4">
                          <div>
                            <Label htmlFor="city">Город *</Label>
                            <Input id="city" required placeholder="Москва" />
                          </div>
                          <div>
                            <Label htmlFor="address">Адрес *</Label>
                            <Input id="address" required placeholder="ул. Ленина, д. 10, кв. 5" />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="postal-code">Индекс</Label>
                              <Input id="postal-code" placeholder="123456" />
                            </div>
                            <div>
                              <Label htmlFor="entrance">Подъезд / Этаж</Label>
                              <Input id="entrance" placeholder="2 подъезд, 3 этаж" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="CreditCard" size={24} />
                      Способ оплаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <label htmlFor="card" className="cursor-pointer flex-1">
                          <p className="font-semibold">Банковской картой онлайн</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, МИР</p>
                        </label>
                      </div>

                      <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="cash" id="cash" />
                        <label htmlFor="cash" className="cursor-pointer flex-1">
                          <p className="font-semibold">Наличными при получении</p>
                          <p className="text-sm text-muted-foreground">Оплата курьеру или на складе</p>
                        </label>
                      </div>

                      <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="invoice" id="invoice" />
                        <label htmlFor="invoice" className="cursor-pointer flex-1">
                          <p className="font-semibold">Безналичный расчёт</p>
                          <p className="text-sm text-muted-foreground">Для юридических лиц</p>
                        </label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="MessageSquare" size={24} />
                      Комментарий к заказу
                    </CardTitle>
                    <CardDescription>Необязательное поле</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      placeholder="Укажите дополнительную информацию для доставки или пожелания к заказу"
                    ></textarea>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Ваш заказ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-semibold">{item.price.toLocaleString()} ₽</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Товары ({cart.length})</span>
                        <span>{subtotal.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{deliveryLabels[deliveryMethod]}</span>
                        <span className={deliveryCost === 0 ? 'text-green-600 font-semibold' : ''}>
                          {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString()} ₽`}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Итого:</span>
                      <span>{total.toLocaleString()} ₽</span>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Icon name="Check" size={20} className="mr-2" />
                      Оформить заказ
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь с условиями{' '}
                      <a href="#" className="underline">
                        политики конфиденциальности
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm opacity-75">© 2024 ПромДвигатель. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}