let arrHolidays = [];

//отримання даних з локального сховища
window.onload = function () {
  const savedHolidays = localStorage.getItem("holidays");
  if (savedHolidays) {
    arrHolidays = JSON.parse(savedHolidays);
  }
};

function calculateVacation() {
  let dateStart, dateEnd, duration;
  dateStart = document.getElementById("date-start").value;
  dateEnd = document.getElementById("date-end").value;
  duration = parseInt(document.getElementById("duration").value);

  //перевірка на кількість заповнених полів
  let filledFieldsCount = 0;
  if (dateStart) {
    filledFieldsCount++;
  }
  if (dateEnd) {
    filledFieldsCount++;
  }
  if (duration) {
    filledFieldsCount++;
  }

  if (filledFieldsCount !== 2) {
    alert("Вкажіть лише два значення для коректного обчислення");
    return;
  }

  //перевірка на коректність вводу дати
  if (new Date(dateStart) > new Date(dateEnd)) {
    alert("Дата початку не може бути пізніше за дату кінця.");
    return;
  }

  //перевірка на припадання дати початку або кінця на неділю
  if (new Date(dateStart).getDay() === 0) {
    alert("Дата початку відпустки потрапляє на неділю!");
  }
  if (new Date(dateEnd).getDay() === 0) {
    alert("Дата завершення відпустки потрапляє на неділю!");
  }

  //виклик функцій для обчислення потрібного значення
  if (dateStart && dateEnd) {
    calculateDuration(dateStart, dateEnd);
  } else if (dateStart && duration) {
    calculatedateEnd(dateStart, duration);
  } else {
    calculatedateStart(dateEnd, duration);
  }
}

function calculatedateStart(dateEnd, duration) {
  let calculatedDate = new Date(dateEnd);
  let holidaysCount = 0;

  while (duration > 0) {
    const isHoliday = arrHolidays.some(
      (holiday) =>
        new Date(holiday.date).toDateString() === calculatedDate.toDateString()
    );

    if (!isHoliday) {
      duration--;
    } else {
      holidaysCount++;
    }
    calculatedDate.setDate(calculatedDate.getDate() - 1);
  }
  calculatedDate.setDate(calculatedDate.getDate() + 1);

  let formattedDate = calculatedDate.toISOString().split("T")[0];
  document.getElementById("date-start").value = formattedDate;
  alert("Дата початку відпустки успішно обчислена!");
}

function calculatedateEnd(dateStart, duration) {
  let calculatedDate = new Date(dateStart);

  while (duration > 0) {
    const isHoliday = arrHolidays.some(
      (holiday) =>
        new Date(holiday.date).toDateString() === calculatedDate.toDateString()
    );

    if (!isHoliday) {
      duration--;
    }

    if (duration > 0) {
      calculatedDate.setDate(calculatedDate.getDate() + 1);
    }
  }

  while (
    arrHolidays.some(
      (holiday) =>
        new Date(holiday.date).toDateString() === calculatedDate.toDateString()
    )
  ) {
    calculatedDate.setDate(calculatedDate.getDate() + 1);
  }

  let formattedDate = calculatedDate.toISOString().split("T")[0];
  document.getElementById("date-end").value = formattedDate;
  alert("Дата кінця відпустки успішно обчислена!");
}

function calculateDuration(dateStart, dateEnd) {
  let start = new Date(dateStart);
  let end = new Date(dateEnd);
  let result = 0;

  for (
    let currentDate = new Date(start);
    currentDate <= end;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    if (
      !arrHolidays.some(
        (holiday) =>
          new Date(holiday.date).toISOString().split("T")[0] ===
          formattedCurrentDate
      )
    ) {
      result++;
    }
  }

  document.getElementById("duration").value = result;
}

function addingHoliday() {
  const holidayName = document.getElementById("holiday-name").value;
  const holidayDate = document.getElementById("date-holiday").value;

  if (holidayName && holidayDate) {
    const holiday = {
      name: holidayName,
      date: new Date(holidayDate),
    };

    arrHolidays.push(holiday);

    localStorage.setItem("holidays", JSON.stringify(arrHolidays));

    document.getElementById("holiday-name").value = "";
    document.getElementById("date-holiday").value = "";
    alert("Святковий день додано!");
  } else {
    alert("Заповніть всі поля!");
  }
}
