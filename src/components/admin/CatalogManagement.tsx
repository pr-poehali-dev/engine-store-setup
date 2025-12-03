import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Engine {
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
}

const engineTypes = {
  diesel: 'Дизельный',
  electric: 'Электрический',
  gasoline: 'Бензиновый',
};

export default function CatalogManagement() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEngine, setEditingEngine] = useState<Engine | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'diesel',
    manufacturer: '',
    power: 0,
    price: 0,
    image: '',
    cylinders: 0,
    displacement: '',
    fuelType: '',
    cooling: '',
  });

  useEffect(() => {
    const savedEngines = localStorage.getItem('engines');
    if (savedEngines) {
      setEngines(JSON.parse(savedEngines));
    }
  }, []);

  const saveEngines = (newEngines: Engine[]) => {
    setEngines(newEngines);
    localStorage.setItem('engines', JSON.stringify(newEngines));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const engineData: Engine = {
      id: editingEngine ? editingEngine.id : Date.now(),
      name: formData.name,
      type: formData.type,
      manufacturer: formData.manufacturer,
      power: Number(formData.power),
      price: Number(formData.price),
      image: formData.image || 'https://cdn.poehali.dev/projects/91c98040-6f4f-4b3b-865e-19c01984a939/files/c2d45395-5e4e-439b-b842-852b06bcb410.jpg',
      specs: {
        cylinders: Number(formData.cylinders),
        displacement: formData.displacement,
        fuelType: formData.fuelType,
        cooling: formData.cooling,
      },
    };

    if (editingEngine) {
      const updatedEngines = engines.map(e => e.id === editingEngine.id ? engineData : e);
      saveEngines(updatedEngines);
    } else {
      saveEngines([...engines, engineData]);
    }

    resetForm();
    setIsAddDialogOpen(false);
    setEditingEngine(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'diesel',
      manufacturer: '',
      power: 0,
      price: 0,
      image: '',
      cylinders: 0,
      displacement: '',
      fuelType: '',
      cooling: '',
    });
  };

  const handleEdit = (engine: Engine) => {
    setEditingEngine(engine);
    setFormData({
      name: engine.name,
      type: engine.type,
      manufacturer: engine.manufacturer,
      power: engine.power,
      price: engine.price,
      image: engine.image,
      cylinders: engine.specs.cylinders,
      displacement: engine.specs.displacement,
      fuelType: engine.specs.fuelType,
      cooling: engine.specs.cooling,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedEngines = engines.filter(e => e.id !== id);
    saveEngines(updatedEngines);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingEngine(null);
    resetForm();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Управление каталогом</CardTitle>
              <CardDescription>Всего товаров: {engines.length}</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setEditingEngine(null); }}>
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить двигатель
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEngine ? 'Редактировать' : 'Добавить'} двигатель</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о двигателе
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Тип</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(engineTypes).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manufacturer">Производитель</Label>
                      <Input
                        id="manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="power">Мощность (л.с.)</Label>
                      <Input
                        id="power"
                        type="number"
                        value={formData.power}
                        onChange={(e) => setFormData({...formData, power: Number(e.target.value)})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Цена (₽)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cylinders">Количество цилиндров</Label>
                      <Input
                        id="cylinders"
                        type="number"
                        value={formData.cylinders}
                        onChange={(e) => setFormData({...formData, cylinders: Number(e.target.value)})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displacement">Объём</Label>
                      <Input
                        id="displacement"
                        placeholder="11.15 л"
                        value={formData.displacement}
                        onChange={(e) => setFormData({...formData, displacement: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Тип топлива</Label>
                      <Input
                        id="fuelType"
                        placeholder="Дизель"
                        value={formData.fuelType}
                        onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cooling">Охлаждение</Label>
                      <Input
                        id="cooling"
                        placeholder="Жидкостное"
                        value={formData.cooling}
                        onChange={(e) => setFormData({...formData, cooling: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="image">URL изображения</Label>
                      <Input
                        id="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Отмена
                    </Button>
                    <Button type="submit">
                      {editingEngine ? 'Сохранить' : 'Добавить'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {engines.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Package" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Товары не добавлены</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {engines.map((engine) => (
                <Card key={engine.id}>
                  <CardContent className="p-4">
                    <img 
                      src={engine.image} 
                      alt={engine.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-2">{engine.name}</h3>
                        <Badge variant="outline">
                          {engineTypes[engine.type as keyof typeof engineTypes]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{engine.manufacturer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{engine.power} л.с.</span>
                        <span className="font-bold">{engine.price.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEdit(engine)}
                        >
                          <Icon name="Pencil" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(engine.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
