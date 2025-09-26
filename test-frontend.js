const puppeteer = require('puppeteer');

async function testFrontend() {
  console.log('🧪 Запуск автотестов фронтенда...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Перехватываем логи консоли
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });

  // Перехватываем ошибки
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  // Перехватываем запросы
  const requests = [];
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      requests.push({
        url: request.url(),
        method: request.method()
      });
    }
  });

  const responses = [];
  page.on('response', async response => {
    if (response.url().includes('/api/')) {
      try {
        const body = await response.text();
        responses.push({
          url: response.url(),
          status: response.status(),
          body: body.substring(0, 500) // Первые 500 символов
        });
      } catch (e) {
        responses.push({
          url: response.url(),
          status: response.status(),
          error: 'Could not read body'
        });
      }
    }
  });

  try {
    // 1. Проверка главной страницы
    console.log('\n📱 Тест 1: Главная страница');
    await page.goto('https://innolab-crm.vercel.app', { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log('✅ Заголовок:', title);

    // 2. Логин
    console.log('\n🔐 Тест 2: Авторизация');

    // Ищем форму логина
    const loginForm = await page.$('form');
    if (loginForm) {
      await page.type('input[type="email"]', 'test@example.com');
      await page.type('input[type="password"]', 'test123');

      console.log('📝 Введены данные для входа');

      // Нажимаем кнопку входа
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.click('button[type="submit"]')
      ]);

      console.log('✅ Логин выполнен');
    } else {
      console.log('❌ Форма логина не найдена');
    }

    // 3. Проверка страницы идей
    console.log('\n💡 Тест 3: Страница идей');
    await page.goto('https://innolab-crm.vercel.app/ideas', { waitUntil: 'networkidle0' });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Ждем загрузки данных

    const ideasContent = await page.evaluate(() => {
      const createButton = document.querySelector('button');
      const ideaCards = document.querySelectorAll('[data-testid="idea-card"], .idea-card, h3, h2');
      const content = document.body.textContent;

      return {
        hasCreateButton: !!createButton,
        createButtonText: createButton?.textContent || 'Не найдена',
        ideaCardsCount: ideaCards.length,
        hasArendaText: content.includes('Аренда'),
        hasDepositText: content.includes('депозит'),
        hasStraxovanieText: content.includes('страхован'),
        fullContent: content.substring(0, 1000)
      };
    });

    console.log('📊 Контент идей:', ideasContent);

    // 4. Проверка канбана
    console.log('\n🌊 Тест 4: Канбан-доска');
    await page.goto('https://innolab-crm.vercel.app/kanban', { waitUntil: 'networkidle0' });

    await new Promise(resolve => setTimeout(resolve, 3000)); // Ждем загрузки данных

    const kanbanContent = await page.evaluate(() => {
      const columns = document.querySelectorAll('[data-testid="kanban-column"], .kanban-column, .bg-gray-50');
      const cards = document.querySelectorAll('[data-testid="kanban-card"], .kanban-card, .bg-white');
      const content = document.body.textContent;

      return {
        columnsCount: columns.length,
        cardsCount: cards.length,
        hasArendaText: content.includes('Аренда'),
        hasGipotezaText: content.includes('Гипотеза') || content.includes('гипотез'),
        hasExperimentText: content.includes('Эксперимент') || content.includes('эксперимент'),
        hasEmptyText: content.includes('пуста') || content.includes('Создайте'),
        fullContent: content.substring(0, 1000)
      };
    });

    console.log('📊 Контент канбана:', kanbanContent);

    // 5. Проверка API запросов
    console.log('\n🌐 Тест 5: API запросы');
    console.log('📡 Запросы:', requests);
    console.log('📥 Ответы:', responses);

    // 6. Проверка логов консоли
    console.log('\n📝 Тест 6: Логи консоли');
    consoleLogs.forEach(log => console.log('  ', log));

    // 7. Проверка ошибок
    console.log('\n❌ Тест 7: Ошибки JavaScript');
    if (errors.length > 0) {
      errors.forEach(error => console.log('  ❌', error));
    } else {
      console.log('  ✅ Ошибок JavaScript не найдено');
    }

    // Итоговый анализ
    console.log('\n📊 ИТОГОВЫЙ АНАЛИЗ:');

    const hasIdeasData = ideasContent.hasArendaText && ideasContent.hasDepositText;
    const hasKanbanData = kanbanContent.hasArendaText && kanbanContent.cardsCount > 0;
    const hasAPIErrors = responses.some(r => r.status >= 400);

    console.log('💡 Идеи отображаются:', hasIdeasData ? '✅ ДА' : '❌ НЕТ');
    console.log('🌊 Канбан заполнен:', hasKanbanData ? '✅ ДА' : '❌ НЕТ');
    console.log('🌐 API работает:', hasAPIErrors ? '❌ ЕСТЬ ОШИБКИ' : '✅ ОК');
    console.log('📝 JS ошибки:', errors.length > 0 ? '❌ ЕСТЬ ОШИБКИ' : '✅ НЕТ');

    if (!hasIdeasData || !hasKanbanData || hasAPIErrors || errors.length > 0) {
      console.log('\n🔍 ДИАГНОСТИКА ПРОБЛЕМ:');

      if (!hasIdeasData) {
        console.log('❌ Проблема с идеями - проверьте API /api/ideas');
      }

      if (!hasKanbanData) {
        console.log('❌ Проблема с канбаном - проверьте API /api/ideas?include=hypotheses,experiments');
      }

      if (hasAPIErrors) {
        console.log('❌ Проблемы с API - смотрите детали выше');
      }

      if (errors.length > 0) {
        console.log('❌ JavaScript ошибки - смотрите детали выше');
      }
    } else {
      console.log('\n🎉 ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!');
    }

  } catch (error) {
    console.error('💥 Ошибка тестирования:', error);
  } finally {
    await browser.close();
  }
}

// Запуск тестов
testFrontend().catch(console.error);