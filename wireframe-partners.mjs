import {img,link,head,section,crumbs} from './wireframe-components.mjs';

const benefits=[
 ['От идеи к изделию','Можно начать с референса, визуализации или готового чертежа. Обсудим конструкцию и детали, которые нужны для изготовления.'],
 ['Согласование до производства','Уточним размеры, рисунок, материалы, покрытие и комплектацию, чтобы ваше решение можно было реализовать на объекте.'],
 ['Понятные роли в проекте','Заранее договоримся, кто общается с заказчиком и согласовывает изменения: вы, наша команда или мы вместе.'],
 ['Условия под вашу задачу','Расскажем о формате сотрудничества и обсудим коммерческие условия с учётом проекта, объёма работ и вашей роли.']
];
const questions=[
 ['На каком этапе лучше обратиться?','Когда уже есть общая идея, стилистика или референсы. На раннем этапе проще обсудить конструкцию, крепления и материалы, пока проект можно скорректировать.'],
 ['Что нужно для первого обсуждения?','Расскажите, какое изделие нужно и где находится объект. Можно приложить эскиз, фотографии, визуализацию, чертежи или примерные размеры. Если проекта пока нет, начнём с вашей задачи.'],
 ['Можно обратиться с одним проектом?','Для знакомства не нужен постоянный поток заказов. Оставьте контакты и опишите текущую задачу — обсудим подходящий формат работы.'],
 ['Какие финансовые условия для партнёров?','Коммерческие условия обсуждаем лично до начала работы. Уточним формат сотрудничества, состав заказа и порядок расчётов. Запросить подробности можно в форме ниже.'],
 ['Как будет проходить общение с моим заказчиком?','На старте согласуем, как удобно вести проект: через вас или совместно с нашей командой. Отдельно определим, кто утверждает эскиз, изменения и готовое изделие.']
];

function partnerForm(){return `<form class="request-form partner-form" data-request data-partner-request>
 <input type="hidden" name="subject" value="Запрос условий сотрудничества">
 <h3>Узнайте условия сотрудничества</h3>
 <p class="muted">Познакомимся, обсудим задачи и расскажем о формате работы</p>
 <div class="row2">
  <label>Ваше имя *<input name="partnerName" autocomplete="name" maxlength="100" required placeholder="Как к вам обращаться"></label>
  <label>Ваша роль *<select name="partnerRole" required><option value="" disabled selected>Выберите роль</option><option>Дизайнер интерьера</option><option>Архитектор</option><option>Представитель студии или бюро</option><option>Другое</option></select></label>
 </div>
 <label><span>Студия или компания <span class="optional">необязательно</span></span><input name="partnerCompany" autocomplete="organization" maxlength="160" placeholder="Название или ссылка на портфолио"></label>
 <label>Телефон или email *<input name="contact" required maxlength="160" placeholder="+7 (…) или email"></label>
 <label><span>О вас или вашем проекте <span class="optional">необязательно</span></span><textarea name="message" rows="3" maxlength="2000" placeholder="С какими объектами работаете? Есть ли задача, которую хотите обсудить?"></textarea></label>
 <label class="file-label"><span>Приложить проект или референс <span class="optional">необязательно</span></span><input type="file" name="attachment" accept="image/*,.pdf,.dwg" multiple><span data-file-names>Файл не выбран</span></label>
 <p class="form-error" role="alert" hidden></p>
 <button class="btn dark" type="submit">Получить условия сотрудничества</button>
 <small class="partner-demo-note">Демонстрационная форма прототипа. Заявка и файлы не отправляются.</small>
 <output class="form-result" aria-live="polite"></output>
</form>`;}

export function partners(){return `${crumbs('Партнёрам')}
<section class="container partner-hero">
 <div><p class="eyebrow">Дизайнерам и архитекторам</p><h1>Кованые изделия<br>для ваших проектов</h1>
 <p class="partner-lead">Воплотим ваш замысел в металле: перила, входные группы, ограждения и предметы интерьера. Обсудим проект, изготовление и установку в удобном для вас формате.</p>
 <div class="actions">${link('Получить условия сотрудничества','#partner-request','dark')}${link('Посмотреть работы','portfolio.html')}</div>
 <div class="partner-hero-points"><span>По вашим эскизам</span><span>Производство в Подольске</span><span>От замера до установки</span></div></div>
 <figure class="partner-hero-image">${img('stairs-9.jpg','Пример кованых перил для интерьерного проекта')}<figcaption>Изделия под архитектуру и стиль вашего объекта</figcaption></figure>
</section>
${section('partner-support',head('Совместная работа','Помогаем пройти путь<br>от эскиза до установки')+`<div class="partner-benefits">${benefits.map(([h,p],i)=>`<div class="panel"><span class="step-num">0${i+1}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>`,'alt')}
${section('partner-products',head('Что можем изготовить','Металл в архитектуре и интерьере')+`<div class="three partner-product-grid">${[
 ['Перила и лестницы','Для внутренних лестниц, крыльца, террас и балконов.','stairs-1.jpg','rails'],
 ['Входные группы и ограждения','Ворота, калитки, заборы и козырьки в стилистике объекта.','gates-1.jpg','gates'],
 ['Мебель и интерьер','Столы, консоли, скамьи и декоративные детали из металла.','excl-1.jpg','furniture']
 ].map(([h,p,photo,category])=>`<a class="partner-product-card" href="catalog.html?category=${category}">${img(photo,h)}<div><h3>${h}</h3><p>${p}</p><span class="small-link">Посмотреть варианты →</span></div></a>`).join('')}</div>`)}
${section('partner-process',head('Как начать','От знакомства к совместному проекту')+`<div class="steps four">${[
 ['Оставьте контакты','Расскажите о своей специализации и задачах. Можно обратиться с конкретным проектом или познакомиться заранее.'],
 ['Обсудим сотрудничество','Расскажем об условиях работы, согласуем роли и удобный способ общения.'],
 ['Разберём ваш проект','Уточним конструкцию и исходные данные. Подготовим предложение по составу, стоимости и срокам.'],
 ['Согласуем реализацию','Утвердим эскиз, смету и порядок работ. Доставку, установку и приёмку обсудим до изготовления.']
 ].map(([h,p],i)=>`<div><span class="step-num">0${i+1}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>`,'alt')}
${section('partner-faq',`<div class="faq-layout"><div><p class="eyebrow">Перед знакомством</p><h2>Вопросы о сотрудничестве</h2>${link('Запросить условия','#partner-request')}</div><div>${questions.map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join('')}</div></div>`,'faq-section')}
${section('partner-request',`<div class="cta partner-cta"><div><p class="eyebrow">Давайте познакомимся</p><h2>Обсудим, как работать<br>над вашими проектами</h2><p>Оставьте заявку — расскажем о сотрудничестве и обсудим, как подключить нашу команду к вашей задаче.</p><ul class="partner-request-points"><li>Какие изделия нужны вашим клиентам.</li><li>На каком этапе подключать производство.</li><li>Как согласовывать решения и общаться с заказчиком.</li><li>Какие условия подходят для вашего проекта.</li></ul><p>Или напишите напрямую:</p><a href="mailto:vankovka@yandex.ru">vankovka@yandex.ru</a><br><a href="tel:+74951345506">+7 (495) 134-55-06</a></div>${partnerForm()}</div>`)}
`;}
