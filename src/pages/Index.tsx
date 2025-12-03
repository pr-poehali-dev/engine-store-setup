import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import Footer from '@/components/Footer';

type Engine = {
  id: number;
  name: string;
  type: string;
  manufacturer: string;
  power: number;
  price: number;
  image: string;
  specs: {
    cylinders: number;
    displacement: string;
    fuelType: string;
    cooling: string;
  };
};

const engines: Engine[] = [
  {
    id: 1,
    name: 'Дизельный двигатель ДД-240',
    type: 'diesel',
    manufacturer: 'ЯМЗ',
    power: 240,
    price: 450000,
    image: 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/c2d45395-5e4e-439b-b842-852b06bcb410.jpg',
    specs: {
      cylinders: 6,
      displacement: '11.15 л',
      fuelType: 'Дизель',
      cooling: 'Жидкостное',
    },
  },
  {
    id: 2,
    name: 'Электродвигатель ЭД-150',
    type: 'electric',
    manufacturer: 'Сименс',
    power: 150,
    price: 320000,
    image: 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/8d0a9532-b32c-4aad-98ba-bff4efd92418.jpg',
    specs: {
      cylinders: 0,
      displacement: 'N/A',
      fuelType: 'Электричество',
      cooling: 'Воздушное',
    },
  },
  {
    id: 3,
    name: 'Бензиновый двигатель БД-180',
    type: 'gasoline',
    manufacturer: 'ВАЗ',
    power: 180,
    price: 280000,
    image: 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/bacc3c31-c102-40f0-b8ca-6012debb0084.jpg',
    specs: {
      cylinders: 4,
      displacement: '2.4 л',
      fuelType: 'Бензин АИ-95',
      cooling: 'Жидкостное',
    },
  },
  {
    id: 4,
    name: 'Дизельный двигатель ДД-320',
    type: 'diesel',
    manufacturer: 'Caterpillar',
    power: 320,
    price: 680000,
    image: 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/c2d45395-5e4e-439b-b842-852b06bcb410.jpg',
    specs: {
      cylinders: 8,
      displacement: '15.2 л',
      fuelType: 'Дизель',
      cooling: 'Жидкостное',
    },
  },
  {
    id: 5,
    name: 'Электродвигатель ЭД-200',
    type: 'electric',
    manufacturer: 'ABB',
    power: 200,
    price: 420000,
    image: 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/8d0a9532-b32c-4aad-98ba-bff4efd92418.jpg',
    specs: {
      cylinders: 0,
      displacement: 'N/A',
      fuelType: 'Электричество',
      cooling: 'Жидкостное',
    },
  },
  {
    id: 6,
    name: 'Бензиновый двигатель БД-250',
    type: 'gasoline',
    manufacturer: 'УМЗ',
    power: 250,
    price: 390000,
    image: 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/bacc3c31-c102-40f0-b8ca-6012debb0084.jpg',
    specs: {
      cylinders: 6,
      displacement: '3.5 л',
      fuelType: 'Бензин АИ-98',
      cooling: 'Жидкостное',
    },
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [powerRange, setPowerRange] = useState<number[]>([0, 400]);
  const [cart, setCart] = useState<Engine[]>([]);
  const [activeSection, setActiveSection] = useState<string>('catalog');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const filteredEngines = engines.filter((engine) => {
    const typeMatch = selectedType === 'all' || engine.type === selectedType;
    const manufacturerMatch = selectedManufacturer === 'all' || engine.manufacturer === selectedManufacturer;
    const powerMatch = engine.power >= powerRange[0] && engine.power <= powerRange[1];
    return typeMatch && manufacturerMatch && powerMatch;
  });

  const addToCart = (engine: Engine) => {
    const newCart = [...cart, engine];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (engineId: number) => {
    setCart(cart.filter((item) => item.id !== engineId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const manufacturers = Array.from(new Set(engines.map((e) => e.manufacturer)));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Settings" size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary font-['Montserrat']">ПромДвигатель</h1>
              <p className="text-sm text-muted-foreground">Профессиональные решения</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 font-['Roboto'] items-center">
            <button onClick={() => setActiveSection('catalog')} className="hover:text-primary transition-colors">
              Каталог
            </button>
            <button onClick={() => setActiveSection('about')} className="hover:text-primary transition-colors">
              О нас
            </button>
            <button onClick={() => setActiveSection('delivery')} className="hover:text-primary transition-colors">
              Доставка
            </button>
            <button onClick={() => setActiveSection('warranty')} className="hover:text-primary transition-colors">
              Гарантия
            </button>
            <button onClick={() => setActiveSection('faq')} className="hover:text-primary transition-colors">
              FAQ
            </button>
            <button onClick={() => setActiveSection('contacts')} className="hover:text-primary transition-colors">
              Контакты
            </button>
          </nav>
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <Button variant="ghost" onClick={() => navigate('/account')}>
                <Icon name="User" size={20} className="mr-2" />
                Профиль
              </Button>
            )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
                <SheetDescription>Товары в вашей корзине</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map((item, index) => (
                      <Card key={`${item.id}-${index}`}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} ₽</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Итого:</span>
                      <span>{totalPrice.toLocaleString()} ₽</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                      Оформить заказ
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'catalog' && (
          <>
            <section className="bg-primary text-primary-foreground py-16 -mx-4 px-4 mb-12 rounded-lg">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 font-['Montserrat']">
                  Промышленные двигатели для вашего бизнеса
                </h2>
                <p className="text-lg opacity-90">
                  Надёжные решения от ведущих производителей. Гарантия качества и профессиональная поддержка.
                </p>
              </div>
            </section>

            <div className="grid lg:grid-cols-4 gap-8 mb-12">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="SlidersHorizontal" size={20} />
                    Фильтры
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Тип двигателя</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        <SelectItem value="diesel">Дизельный</SelectItem>
                        <SelectItem value="electric">Электрический</SelectItem>
                        <SelectItem value="gasoline">Бензиновый</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Производитель</label>
                    <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все производители</SelectItem>
                        {manufacturers.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Мощность: {powerRange[0]} - {powerRange[1]} л.с.
                    </label>
                    <Slider
                      min={0}
                      max={400}
                      step={10}
                      value={powerRange}
                      onValueChange={setPowerRange}
                      className="mt-4"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedType('all');
                      setSelectedManufacturer('all');
                      setPowerRange([0, 400]);
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-muted-foreground">Найдено: {filteredEngines.length} двигателей</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredEngines.map((engine) => (
                    <Card key={engine.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <img
                          src={engine.image}
                          alt={engine.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <CardTitle className="font-['Montserrat']">{engine.name}</CardTitle>
                        <CardDescription>{engine.manufacturer}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          <Badge variant="secondary">{engine.type === 'diesel' ? 'Дизельный' : engine.type === 'electric' ? 'Электрический' : 'Бензиновый'}</Badge>
                          <Badge variant="outline">{engine.power} л.с.</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Цилиндры:</span>
                            <span className="font-semibold">{engine.specs.cylinders || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Объём:</span>
                            <span className="font-semibold">{engine.specs.displacement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Топливо:</span>
                            <span className="font-semibold">{engine.specs.fuelType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Охлаждение:</span>
                            <span className="font-semibold">{engine.specs.cooling}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold">{engine.price.toLocaleString()} ₽</span>
                        <Button onClick={() => addToCart(engine)}>
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'about' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 font-['Montserrat']">О компании</h2>
            <Card>
              <CardContent className="p-8 space-y-4">
                <p className="text-lg">
                  <strong>ПромДвигатель</strong> — ведущий поставщик промышленных двигателей с 2005 года. Мы
                  специализируемся на поставке качественного оборудования для различных отраслей промышленности.
                </p>
                <p>
                  Наша команда профессионалов обладает многолетним опытом работы в области силовых агрегатов. Мы
                  предлагаем только проверенные решения от надёжных производителей.
                </p>
                <div className="grid md:grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <Icon name="Award" size={48} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-bold mb-2">18+ лет</h3>
                    <p className="text-sm text-muted-foreground">На рынке</p>
                  </div>
                  <div className="text-center">
                    <Icon name="Users" size={48} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-bold mb-2">2000+</h3>
                    <p className="text-sm text-muted-foreground">Довольных клиентов</p>
                  </div>
                  <div className="text-center">
                    <Icon name="Package" size={48} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-bold mb-2">500+</h3>
                    <p className="text-sm text-muted-foreground">Моделей в наличии</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'delivery' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 font-['Montserrat']">Доставка и оплата</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Truck" size={24} />
                    Способы доставки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-semibold">Курьерская доставка</p>
                      <p className="text-sm text-muted-foreground">По Москве и области</p>
                    </div>
                    <span className="font-bold">от 2000 ₽</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-semibold">Транспортная компания</p>
                      <p className="text-sm text-muted-foreground">По всей России</p>
                    </div>
                    <span className="font-bold">Рассчитывается</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Самовывоз</p>
                      <p className="text-sm text-muted-foreground">Со склада в Москве</p>
                    </div>
                    <span className="font-bold text-green-600">Бесплатно</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CreditCard" size={24} />
                    Способы оплаты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Банковский перевод для юридических лиц
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Наличными при получении
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      Картой онлайн
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'warranty' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 font-['Montserrat']">Гарантия</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Shield" size={24} />
                  Гарантийные обязательства
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  На все двигатели распространяется официальная гарантия производителя. Срок гарантии зависит от
                  модели и производителя, но составляет не менее 12 месяцев.
                </p>
                <div className="bg-accent/10 p-4 rounded-lg space-y-2">
                  <h3 className="font-bold flex items-center gap-2">
                    <Icon name="CheckCircle2" size={20} className="text-green-600" />
                    Что входит в гарантию:
                  </h3>
                  <ul className="ml-7 space-y-1 text-sm">
                    <li>• Бесплатный ремонт или замена при заводском браке</li>
                    <li>• Консультации специалистов по эксплуатации</li>
                    <li>• Техническая поддержка 24/7</li>
                    <li>• Поставка оригинальных запчастей</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Для получения гарантийного обслуживания необходимо предоставить документы, подтверждающие покупку, и
                  соблюдение условий эксплуатации.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 font-['Montserrat']">Часто задаваемые вопросы</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Как выбрать подходящий двигатель?
                </AccordionTrigger>
                <AccordionContent>
                  Выбор двигателя зависит от ваших задач: типа оборудования, требуемой мощности, условий эксплуатации.
                  Наши специалисты помогут подобрать оптимальное решение. Свяжитесь с нами по телефону или через форму
                  обратной связи.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Есть ли товар в наличии на складе?
                </AccordionTrigger>
                <AccordionContent>
                  Большинство представленных моделей есть в наличии на нашем складе в Москве. Актуальную информацию о
                  наличии конкретной модели уточняйте у менеджеров.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Предоставляете ли вы услуги по установке?
                </AccordionTrigger>
                <AccordionContent>
                  Да, мы предлагаем услуги по профессиональной установке и пуско-наладке оборудования. Стоимость
                  зависит от сложности работ и региона. Подробности уточняйте при оформлении заказа.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Можно ли вернуть товар?
                </AccordionTrigger>
                <AccordionContent>
                  Возврат возможен в течение 14 дней с момента получения, если товар не был в эксплуатации и сохранена
                  упаковка. Технически сложные товары подлежат возврату только при наличии заводского брака.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold">
                  Работаете ли вы с юридическими лицами?
                </AccordionTrigger>
                <AccordionContent>
                  Да, мы активно работаем с юридическими лицами. Предоставляем все необходимые документы для
                  бухгалтерии, работаем по безналичному расчёту, возможна отсрочка платежа для постоянных клиентов.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 font-['Montserrat']">Контакты</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Свяжитесь с нами</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="MapPin" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Адрес офиса и склада:</p>
                      <p className="text-muted-foreground">г. Москва, ул. Промышленная, д. 15, стр. 3</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Phone" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Телефон:</p>
                      <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                      <p className="text-sm text-muted-foreground">Пн-Пт: 9:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Mail" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p className="text-muted-foreground">info@promdvigatel.ru</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" size={20} className="text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Режим работы:</p>
                      <p className="text-muted-foreground">Понедельник - Пятница: 9:00 - 18:00</p>
                      <p className="text-muted-foreground">Суббота: 10:00 - 15:00</p>
                      <p className="text-muted-foreground">Воскресенье: Выходной</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Напишите нам</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Имя</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Сообщение</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-md"
                        rows={4}
                        placeholder="Ваше сообщение"
                      ></textarea>
                    </div>
                    <Button className="w-full">
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3 font-['Montserrat']">ПромДвигатель</h3>
              <p className="text-sm opacity-90">
                Профессиональные промышленные двигатели для вашего бизнеса. Надёжность и качество с 2005 года.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Контакты</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>+7 (495) 123-45-67</p>
                <p>info@promdvigatel.ru</p>
                <p>г. Москва, ул. Промышленная, 15</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Информация</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>Пн-Пт: 9:00 - 18:00</p>
                <p>Сб: 10:00 - 15:00</p>
                <p>Вс: Выходной</p>
              </div>
            </div>
          </div>
          <Separator className="my-6 opacity-30" />
          <p className="text-center text-sm opacity-75">© 2024 ПромДвигатель. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}