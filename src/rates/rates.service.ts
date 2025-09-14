import { Injectable, HttpException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CurrencyPair } from './rates.type';

@Injectable()
export class RatesService {
  // private readonly url = 'https://www.x-rates.com/table/?from=RUB&amount=1';

  async getRateByCode(code: string): Promise<CurrencyPair[]> {

    const url = new URL('https://www.x-rates.com/table/')
    url.searchParams.append('from', code);
    url.searchParams.append('amount', '1');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const rates: CurrencyPair[] = [];

      $('table.tablesorter.ratesTable tbody tr').each((_, row) => {
        const cols = $(row).find('td');
        const target = new URLSearchParams($(cols).find('a').attr('href')).get('to');
        const rateText = $(cols[1]).text().trim();

        if (target && rateText) {
          const rate = parseFloat(rateText);
          rates.push({
            base: code,
            target,
            rate,
            amount: 1,
          });
        }
      });

      return rates;
    } catch (err) {
      throw new HttpException(
        `Ошибка при получении данных: ${err.message}`,
        500,
      );
    }
  }

  async getPopularRates() {
    try {
      const response = await fetch('https://www.google.com/finance/markets/currencies', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // выбираем второй ul внутри role="main"
      const secondUl = $('div[role="main"] ul').eq(1);
      
      if (!secondUl || secondUl.length === 0) {
        throw new Error('Второй список ul не найден');
      }

      const pairs: CurrencyPair[] = [];

      secondUl.find('li').each((_, li) => {
        const text = $(li).text().trim().slice(3,12).split(' / ');
        const rate = parseFloat($(li).find('span').first().text().trim());
        pairs.push({
          base: text[0],
          target: text[1],
          rate: rate,
          amount: 1,
        });
      });

      return pairs;
    } catch (err) {
      throw new HttpException(
        `Ошибка при получении данных: ${err.message}`,
        500,
      );
    }
  }
}
