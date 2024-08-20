
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { varAlpha } from 'src/theme/styles';
import { FiltersBlock, FiltersResult, chipProps } from '@fuse/components/filters-result';
import { resetFilters } from '../store/filtersSlice';
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next';


// ----------------------------------------------------------------------

type Props = {
  totalResults?: number;
  sx?: SxProps<Theme>;
  filters: any;
};

export function ProductFiltersResult({ filters, totalResults, sx }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('shopApp');

  const handleRemoveGender = (inputValue: string) => {
    const newValue = filters.gender.filter((item) => item !== inputValue);

    filters.setState({ gender: newValue });
  };

  const handleRemoveCategory = () => {
    filters.setState({ category: 'all' });
  };

  const handleRemoveColor = (inputValue: string | string[]) => {
    const newValue = filters.colors.filter((item: string) => item !== inputValue);

    filters.setState({ colors: newValue });
  };

  const handleRemovePrice = () => {
    filters.setState({ priceRange: [0, 200] });
  };

  const handleRemoveRating = () => {
    filters.setState({ rating: '' });
  };

  const handleResetFilters = () => dispatch(resetFilters());

  return (
    <FiltersResult totalResults={totalResults} onReset={handleResetFilters} sx={sx}>
      <FiltersBlock label={t("GENDER")} isShow={!!filters.gender.length}>
        {filters.gender.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveGender(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label={t("CATEGORY")} isShow={filters.category !== 'all'}>
        <Chip {...chipProps} label={filters.category} onDelete={handleRemoveCategory} />
      </FiltersBlock>

      <FiltersBlock label={t("COLORES")} isShow={!!filters.colors.length}>
        {filters.colors.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={
              <Box
                sx={{
                  ml: -0.5,
                  width: 18,
                  height: 18,
                  bgcolor: item,
                  borderRadius: '50%',
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.palette.common.whiteChannel, 0.24)}`,
                }}
              />
            }
            onDelete={() => handleRemoveColor(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label={t("PRICE")}
        isShow={filters.priceRange[0] !== 0 || filters.priceRange[1] !== 200}
      >
        <Chip
          {...chipProps}
          label={`$${filters.priceRange[0]} - ${filters.priceRange[1]}`}
          onDelete={handleRemovePrice}
        />
      </FiltersBlock>

      <FiltersBlock
        label={t("RATING")} isShow={!!filters.rating}>
        <Chip {...chipProps} label={filters.rating} onDelete={handleRemoveRating} />
      </FiltersBlock>
    </FiltersResult>
  );
}
