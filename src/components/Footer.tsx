import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const phoneNumber = '+79001234567';
  const telegramUrl = 'https://t.me/Oman_Shaman';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Settings" size={32} className="text-primary" />
              <div>
                <h3 className="text-xl font-bold font-['Montserrat']">ПромДвигатель</h3>
                <p className="text-sm text-slate-400">Профессиональные решения</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Поставка промышленных двигателей для вашего бизнеса. Качество, надёжность, гарантия.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Дизельные двигатели</li>
              <li>Электродвигатели</li>
              <li>Бензиновые двигатели</li>
              <li>Запчасти</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>О компании</li>
              <li>Доставка и оплата</li>
              <li>Гарантия</li>
              <li>Контакты</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-3 text-slate-400 text-sm">
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Icon name="Phone" size={16} />
                {phoneNumber}
              </a>
              <a 
                href="mailto:info@promdvigatel.ru"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Icon name="Mail" size={16} />
                info@promdvigatel.ru
              </a>
              <div className="flex gap-3 pt-2">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="Telegram"
                >
                  <Icon name="Send" size={18} />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <Icon name="MessageCircle" size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} ПромДвигатель. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
