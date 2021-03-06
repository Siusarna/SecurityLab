
Лабораторна робота №5
--

Реєстрація
-- --
0. Обмеження доступу до бази даних (використання `security groups` на `AWS`).

1. Використання `rate-limits` - обмеження кількісті запитів із одного IP-адреса.
   На даний момент використана конфігурація, яка забороняє опрацьовувати більше 2 запитів в 10 хвилин для реєстрації та більше 5 запитів авторизації.

2. Валідація вхідних даних. Для ендпоінтів авторизації та реєстрації використано одну і ту ж схему валідування:

   - Будь які неочікувані поля - видалити
   - Перевірка емейлу на валідність
   - Перевірка що пароль містить хоча б 1 малу літеру, 1 велику літеру, 1 цифру, 1 спец символ.
   - Перевірка що довжина пароля більша 8 символів та менша 64.
     Згідно із `NIST SP800-63B` пароль меншої довжини вважається слабким.
     Максимальна довжина була обмежена для захисту від атаки Long password denial of service.
   - Перевірка, що даний пароль не входить в топ 10000 популярних паролів
     
3. Використання `constraint` в базі даних для забезнечення унікальності по полю email

4. Для хешування пароля було використано `argon2id`. Вибір було зроблено згідно із [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id). Окрім цього даний алгоритм є переможцем  Password Hashing Competition.
   Сіль було згенеровано та збережено в хеші власне алгоритмом.

5. Оскільки сучасні криптографічні алгоритми хешування не задизайнені для використання pepper,
   а неправильне використання може зробити загальну стійкість хеш функції меньшою.
   Було прийнятно рішення згенерований хеш додатково зашифровувати `AES-256-cbc`.
   [Link](https://stackoverflow.com/questions/16891729/best-practices-salting-peppering-passwords#:~:text=your%20own%20crypto...-,The%20Better%20Way,-So%2C%20out%20of)
   
6. Додання поля `passwordVersion` в базу даних для потенційного майбутнього використання при потребі зміни алгоритму хешування чи шифрування

7. Також додані фейкові користувачі з слабкозахешованими паролями. 
   Якщо поле `lastAuthDate` змінилося - це означає що хтось намагається атакувати систему.


Авторизація

Для авторизації використовуються пункти 1-2 із списка вище

3. Витягується користувач із бази даних за введеним емейлом.

4. Якщо такого користувача не знайдено - повертається статус 400 - Bad Request. 

5. Розшифровується пароль, витягнутий із бд.

6. За допомогою бібліотеки `argon2` виконується порівняння хеша, та введеного пароля.

Даний порядок дій піддається `time-based attack` оскільки існує `quick exit`. Для вирішення цієї проблеми потрібно: 

1. під час реєстрації не показувати помилку із текстом `User with this email has already exists`, а відправляти в будь якому випадку лист на даний емейл, а користувачу повертати `A link to activate your account has been emailed to the address provided.`. Таким чином це дозволить перевірити існуючість емейлу та не дасть інформації атакуючому ніякої інформації про існування аккаунта із даним емейлом.

2. Змінити порядок дій в алгоритмі авторизації. Наприклад повертати результат в будь-якому випадку через 5 секунд.


Лабораторна робота №6
--

1. How did you implement your storage? - У якості секретної інформації була обрана 
   адреса користувача та його номер телефону, які він вводить під час реєстрації.
   
      - Вся секретна інформація шифрується за допомогою `aes-256-gcm`.
      - Кожного разу генерується новий `init vector` довжиною 16 за допомогою [randomFill](https://nodejs.org/api/crypto.html#cryptorandomfillbuffer-offset-size-callback)
      - Після завершення шифрування викликається метод [getAuthTag](https://nodejs.org/api/crypto.html#ciphergetauthtag)
      - Зашифрована інформація, init vector та тег зберігаються в БД в jsonb форматі
      - Під час кожного витягування секретної інформації спочатку отримується все необхідне із БД
      - Наступний крок це розшифрування за допомогою збережених даних
      - Повернення результату на фронтенд.
   
   Також варто зазначити що було використано `AWS KMS`
   
   Ключ було згенеровано за допомогою функції [GenerateDataKey](https://docs.aws.amazon.com/kms/latest/APIReference/API_GenerateDataKey.html)

   Дана функція повертає згенерований ключ та зашифрований згенерований ключ вказаної довжини. 
   В цьому випадку це 32 байти.
   
   Згенерований ключ ми не зберігаємо, а використовуємо тільки зашифровану його версію.
   
   Зберігаємо дану версію ключа в змінних середовища. Для отримання власне ключа,
   потрібно зробити запит, використовуючи 
   як параметри `AccessKey`, `SecretAccessKey`, `regionId`, `CMSIdentifier`
   та власне зашифровану версію ключа.
   

2. Why did you choose particular storage options/algorithms/libs etc?
   
   AWS KMS було обрано через:
      - Власне бекенд було задеплоєно на AWS
      - Це зручний в користуванні сервіс, який бере на себе обовязки створення на менеджменту ключі
      - 20000 реквестів безплатні
      - Розв'язує проблему зберігання ключа на сервері у відкритому вигляді
        
   `aes-256-gcm` було обрано через те що це режим роботи 
   широковідомого криптографічно стійкого алгоритму, який (режим) надає можливість
   автентифікованого шифрування надаючи як конфіденційність, 
   так і автентифікацію переданих даних (гарантуючи їх цілісність). 
   Оскільки даний алгоритм надає автентифікацію переданих даних, то це захищає від
   атак типу men-in-the-middle.
   
   Ключ довжиною 256 біт, зробить підбирання ключа майже неможливим.
   
3. What are the possible attack vectors on your system (i.e. how the stored information may be stolen)?
   1. Отримання фізичного доступу до сервера або бази даних
   2. Отримання доступу до сервера, таким чином нападник отримає 
      доступ до зашифрованих ключів, та всіх необхідних даних для їхнього розшифровування
   3. Long sensitive info denial of service. 
      Оскільки немає валідації на довжину адреси, це створює потенційну можливість
      надсилання даних великого об'єму, що призведе до того, 
      що сервер не буде відповідати

Лабораторна робота №7
--

1. Why did you choose the cipher suites/protocol versions/algorithms etc. 
   
   Було обрано TLS 1.3, оскільки це остання, отже найбільш захищена версія протоколу 
   Версія 1.3 сильно зменшилась кількість можливих алгоритмів (до 5),
   проте в даному випадку дозволено використовувати тільки 3 алгоритми, а саме
      - 'TLS_AES_256_GCM_SHA384'
      - 'TLS_CHACHA20_POLY1305_SHA256'
      - 'TLS_AES_128_GCM_SHA256'
      
   [За словами](https://nodejs.org/api/tls.html#:~:text=The%20first%203%20are%20enabled%20by%20default.%20The%20last%202%20CCM%2Dbased%20suites%20are%20supported%20by%20TLSv1.3%20because%20they%20may%20be%20more%20performant%20on%20constrained%20systems%2C%20but%20they%20are%20not%20enabled%20by%20default%20since%20they%20offer%20less%20security.) 
   розробників NodeJs, алгоритми на основі CCM були залишені в протоколі, 
   тому що вони можуть бути більш продуктивними в системах із обмеженими можливостями,
   проте не використовуються за замовчанням, бо пропонують менший рівень безпеки.
   
   В принципі хто я такий, щоб сперечатися із ними :)

2. Where does every component (keys, certificates) reside on your server
   
   На даний момент всі компоненти зберігаються напряму в файловій системі, та добавлені
   в гіт ігнор. Проте та мою думку в ідеалі повинно використовуватися спеціальне
   сховище для сертифікатів, щось накшталт [Hashicorp Vault](https://www.vaultproject.io/).
   Це спростить як передачу сертифікатів між розробниками, так і дозволить більш безпечно їх зберігати.
   