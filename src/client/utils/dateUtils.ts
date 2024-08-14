const parseRangeDate = (
  dateString: string,
): {startDate: Date | null; endDate: Date | null} => {
  const rangeMatch = dateString.match(
    /^(\d{4}[./-]\d{2}[./-]\d{2})\s*[-~]\s*(\d{4}[./-]\d{2}[./-]\d{2}|채용시까지|영입종료시)$/,
  );

  if (rangeMatch) {
    const startDateString = rangeMatch[1].replace(/[./]/g, '-');
    const endDateString = rangeMatch[2].replace(/[./]/g, '-');

    return {
      startDate: new Date(startDateString),
      endDate:
        endDateString === '채용시까지' || endDateString === '영입종료시'
          ? null
          : new Date(endDateString),
    };
  }

  const singleDateMatch = dateString.match(/^(\d{4}[./-]\d{2}[./-]\d{2})$/);

  if (singleDateMatch) {
    const dateStringISO = singleDateMatch[1].replace(/[./]/g, '-');
    return {
      startDate: new Date(dateStringISO),
      endDate: null,
    };
  }

  return {
    startDate: null,
    endDate: null,
  };
};

const parseSpecialDate = (dateString: string): number => {
  if (dateString === '채용시까지' || dateString === '영입종료시') {
    return Number.MAX_SAFE_INTEGER;
  }
  return -1;
};

export {parseRangeDate, parseSpecialDate};
