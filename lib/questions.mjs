export const topics = ['Натуральные числа','Сложение и вычитание','Умножение','Деление','Порядок действий','Делимость','Обыкновенные дроби','Десятичные дроби','Проценты','Пропорции','Отрицательные числа','Степени','Корни','Линейные уравнения','Неравенства','Системы уравнений','Многочлены','Квадратные уравнения','Функции и графики','Прогрессии','Планиметрия','Стереометрия','Тригонометрия','Логарифмы','Комбинаторика','Вероятность','Статистика','Пределы','Производные','Применение производных','Интегралы','Матрицы','Комплексные числа','Дифференциальные уравнения','Ряды и многомерный анализ'];
// Ten distinct parameterised exercises per topic; answers never sent to clients.
export function question(level,index,seed=0){
 // Independent deterministic parameters: no answer is derived from the previous exercise.
 let entropy=(seed ^ Math.imul(level,0x9e3779b9) ^ Math.imul(index+1,0x85ebca6b))>>>0;
 const draw=max=>{entropy=(entropy+0x6d2b79f5)>>>0;let t=entropy;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)%max;};
 const n=2+draw(10), k=2+draw(5), a=n+2+draw(12);
 let text,answer,hint;
 switch(level){
 case 1:text=`Какое число следует за ${a*10+index}?`;answer=a*10+index+1;hint='Следующее натуральное число больше предыдущего на одну единицу. Проверь, не названо ли предыдущее число.';break;
 case 2:text=`${a*13} − ${n*4} + ${k}`;answer=a*13-n*4+k;hint='Сложение и вычитание выполняй слева направо. Проверь перенос через десяток.';break;
 case 3:text=`${a} × ${n}`;answer=a*n;hint='Умножение — повторное сложение. Можно разложить один множитель: a(b+c)=ab+ac.';break;
 case 4:text=`${a*n} ÷ ${n}`;answer=a;hint='Деление обратно умножению: если x ÷ b = c, то c × b = x.';break;
 case 5:text=`(${a} + ${n}) × ${k} − ${n}`;answer=(a+n)*k-n;hint='Сначала скобки, затем умножение, затем вычитание. Не вычисляй всё подряд слева направо.';break;
 case 6:text=`Найди НОД чисел ${n*6} и ${n*9}.`;answer=n*3;hint='Разложи числа на простые множители и возьми общие множители в минимальных степенях.';break;
 case 7:text=`Вычисли 1/${n} + 2/${n}. Введи дробь.`;answer=3/n;hint='При одинаковых знаменателях складывают только числители: a/c+b/c=(a+b)/c.';break;
 case 8:text=`${(a/10).toFixed(1)} + ${(n/100).toFixed(2)}`;answer=a/10+n/100;hint='Выровняй десятичные запятые. Десятые складывай с десятыми, сотые — с сотыми.';break;
 case 9:text=`Найди ${n*5}% от ${k*100}.`;answer=n*5*k;hint='p процентов от числа A: A × p / 100. Процент — сотая доля.';break;
 case 10:text=`Найди x: x / ${n} = ${a} / ${k*n}.`;answer=a/k;hint='У пропорции равны произведения крест-накрест: a/b=c/d ⇒ ad=bc.';break;
 case 11:text=`(${-a}) × ${n} + ${k}`;answer=-a*n+k;hint='Отрицательное на положительное даёт отрицательное. Сначала умножение, потом сложение.';break;
 case 12:text=`Вычисли ${k}^${n+3} / ${k}^${n}.`;answer=k**3;hint='При делении степеней с одинаковым основанием показатели вычитаются: a^m/a^n=a^(m−n).';break;
 case 13:text=`√${a*a} + √${n*n}`;answer=a+n;hint='Арифметический квадратный корень неотрицателен. √(x²)=|x|. Сначала вычисли каждый корень.';break;
 case 14:text=`Реши уравнение: ${k}x + ${n} = ${k*a+n}.`;answer=a;hint='Вычти свободный член из обеих частей, затем раздели обе части на коэффициент при x.';break;
 case 15:text=`Найди наибольшее целое x: −${k}x > −${k*a}.`;answer=a-1;hint='При делении неравенства на отрицательное число знак меняется. Строгое неравенство не включает границу.';break;
 case 16:text=`x + y = ${a+n}; x − y = ${a-n}. Найди x.`;answer=a;hint='Сложи уравнения: члены с y сократятся. Не забудь коэффициент при x после сложения.';break;
 case 17:text=`Найди коэффициент при x в (x + ${n})(x − ${k}).`;answer=n-k;hint='Раскрой скобки по распределительному закону. Собери только слагаемые первой степени.';break;
 case 18:text=`Найди больший корень: x² − ${a+n}x + ${a*n} = 0.`;answer=a;hint='Теорема Виета: сумма корней равна −b/a, произведение c/a. Из двух корней выбери больший.';break;
 case 19:text=`f(x) = ${k}x² − ${n}. Найди f(−${n}).`;answer=k*n*n-n;hint='Подставь аргумент в скобках. Квадрат отрицательного числа положителен.';break;
 case 20:text=`Арифметическая прогрессия: a₁=${k}, d=${n}. Найди a₁₀.`;answer=k+9*n;hint='Формула: aₘ=a₁+(m−1)d. Между первым и десятым членами девять шагов.';break;
 case 21:text=`Катеты прямоугольного треугольника ${3*n} и ${4*n}. Найди гипотенузу.`;answer=5*n;hint='Теорема Пифагора: c²=a²+b². После сложения квадратов извлеки корень.';break;
 case 22:text=`Радиус цилиндра ${n}, высота ${k}. Найди V/π.`;answer=n*n*k;hint='Объём цилиндра V=πr²h. В задаче нужен коэффициент при π, а не полный объём.';break;
 case 23:text=`В прямоугольном треугольнике противолежащий катет ${n}, гипотенуза ${a}. Найди sin α.`;answer=n/a;hint='sin α = противолежащий катет / гипотенуза. Не перепутай с косинусом.';break;
 case 24:text=`Вычисли log₂(${2**n}).`;answer=n;hint='logₐ b — показатель степени, в которую нужно возвести a, чтобы получить b.';break;
 case 25:text=`Сколькими способами можно выбрать 2 человека из ${a}? Порядок не важен.`;answer=a*(a-1)/2;hint='Сочетания: C(n,2)=n(n−1)/2. Деление на 2 исключает повторный подсчёт пары.';break;
 case 26:text=`В мешке ${n} красных и ${k} синих шаров. Вероятность вытащить красный?`;answer=n/(n+k);hint='Вероятность = число благоприятных исходов / число всех равновозможных исходов.';break;
 case 27:text=`Найди среднее арифметическое: ${n}, ${n+2}, ${n+4}, ${n+6}.`;answer=n+3;hint='Сложи все наблюдения и раздели на их количество. Не путай сумму со средним.';break;
 case 28:text=`lim при x → ${n}: (x² − ${n*n}) / (x − ${n})`;answer=2*n;hint='Разложи разность квадратов: x²−a²=(x−a)(x+a). Сократи при x≠a, затем переходи к пределу.';break;
 case 29:text=`f(x)=x³ + ${k}x. Найди f′(${n}).`;answer=3*n*n+k;hint='(x^m)′=m·x^(m−1), (kx)′=k. Сначала найди производную, затем подставь точку.';break;
 case 30:text=`f(x)=x² − ${2*n}x + ${k}. При каком x функция минимальна?`;answer=n;hint='Найди стационарную точку из f′(x)=0. Положительная вторая производная подтверждает минимум.';break;
 case 31:text=`Вычисли ∫ от 0 до ${n} (2x + ${k}) dx.`;answer=n*n+k*n;hint='Найди первообразную по правилу ∫x^m dx=x^(m+1)/(m+1)+C. Затем F(b)−F(a).';break;
 case 32:text=`Найди определитель матрицы [[${n}, 2], [3, ${k}]].`;answer=n*k-6;hint='Для матрицы 2×2: det([[a,b],[c,d]])=ad−bc. Порядок вычитания важен.';break;
 case 33:text=`Найди действительную часть (${n} + 2i)(${k} − 3i).`;answer=n*k+6;hint='Раскрой скобки и используй i²=−1. Действительная часть — сумма членов без i.';break;
 case 34:text=`y′=${k}y, y(0)=${n}. Найди y(ln 2).`;answer=n*2**k;hint='Решение y′=ky имеет вид y=C·e^(kx). Найди C из начального условия; e^(k ln a)=a^k.';break;
 case 35:if(index<5){text=`Найди сумму ряда Σ (от m=0 до ∞) ${n}·(1/${k+1})^m.`;answer=n*(k+1)/k;hint='Геометрический ряд сходится при |q|<1. Его сумма S=a₀/(1−q). Проверь начальный индекс.';}else{text=`f(x,y)=x²y + ${k}y². Найди ∂f/∂y в точке (${n}, 1).`;answer=n*n+2*k;hint='При дифференцировании по y переменная x считается константой. Сначала производная, потом подстановка точки.';}break;
 default:throw new Error('Invalid level');
 }
 return {id:`${level}:${index}:${seed}`,text,answer,hint,topic:topics[level-1]};
}
export function parseAnswer(s){if(typeof s!=='string'||s.length>80)return NaN; s=s.trim().replaceAll(',','.').replaceAll('−','-');if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)){const [a,b]=s.split('/').map(Number);return b===undefined?a:a/b;}return NaN;}
export function isCorrect(s,q){const v=parseAnswer(s);return Number.isFinite(v)&&Math.abs(v-q.answer)<=Math.max(1e-4,Math.abs(q.answer)*1e-5);}
export function initial(seed){return {level:1,index:0,correct:0,mistakes:0,points:0,seed,completed:[],scores:{},status:'playing',version:0,last:null};}
export function publicState(s){const q=s.status==='playing'?question(s.level,s.index,s.seed):null;return {...s,question:q?{id:q.id,text:q.text,topic:q.topic}:null};}
export function advance(s,input){
 if(s.status!=='playing')throw new Error('Игра сейчас не ожидает ответа');
 const q=question(s.level,s.index,s.seed),ok=isCorrect(input,q);
 const next={...s,index:s.index+1,correct:s.correct+(ok?1:0),mistakes:s.mistakes+(ok?0:1),version:s.version+1,last:{ok,question:q.text,hint:ok?'Отлично! Продолжай в том же духе.':q.hint,input}};
 const scores={...(s.scores||{})};
 next.points=Object.entries(scores).reduce((sum,[level,score])=>sum+(Number(level)===s.level?0:score),0)+Math.max(scores[s.level]||0,next.correct*10);
 if(next.mistakes>=3)return {...next,status:'failed',points:Object.values(scores).reduce((a,b)=>a+b,0)};
 if(next.index===10){
   next.completed=[...new Set([...(s.completed||[]),s.level])];
   scores[s.level]=Math.max(scores[s.level]||0,next.correct*10);next.scores=scores;
   next.points=Object.values(scores).reduce((a,b)=>a+b,0);
   next.status=next.completed.length===35?'won':'passed';
 }
 return next;
}
