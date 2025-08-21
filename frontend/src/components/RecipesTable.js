import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Drawer,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import CloseIcon from "@mui/icons-material/Close";

export default function RecipesTable() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Two states: one for typing, one for applied filters
  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
    total_time: "",
    serves: "",
  });
  const [searchFilters, setSearchFilters] = useState(filters);

  // Format nutrient keys nicely
  const formatLabel = (key) => {
    return key
      .replace(/Content/g, "")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());
  };

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError("");

        const hasFilters = Object.values(searchFilters).some(
          (v) => v.trim() !== ""
        );
        const queryParams = new URLSearchParams({
          page: page + 1,
          limit: rowsPerPage,
          ...searchFilters,
        }).toString();

        const url = hasFilters
          ? `http://localhost:5000/api/recipes/search?${queryParams}`
          : `http://localhost:5000/api/recipes?${queryParams}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch recipes");

        const data = await res.json();
        setRecipes(data.data || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
        setError("No data available");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [page, rowsPerPage, searchFilters]);

  // Handle typing in filters
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply filters only on Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  // Apply filters function (used by Enter & Button)
  const applyFilters = () => {
    setPage(0);
    setSearchFilters(filters);
  };

  const hasFilters = Object.values(searchFilters).some((v) => v.trim() !== "");

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Recipes table
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : recipes.length === 0 ? (
        <Typography sx={{ mt: 2 }}>
  {hasFilters ? (
    <>
      No recipes found. <br />
      Please try again by adjusting filters. <br />
      Nice to have.
    </>
  ) : (
    "Nice to have."
  )}
</Typography>

      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ maxWidth: 200 }}>Title</TableCell>
                <TableCell>Cuisine</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Total Time</TableCell>
                <TableCell>Serves</TableCell>
                <TableCell></TableCell>
              </TableRow>
              {/* Filter row */}
              <TableRow>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Filter by title"
                    value={filters.title}
                    onChange={(e) =>
                      handleFilterChange("title", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Filter by cuisine"
                    value={filters.cuisine}
                    onChange={(e) =>
                      handleFilterChange("cuisine", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Min rating"
                    type="number"
                    value={filters.rating}
                    onChange={(e) =>
                      handleFilterChange("rating", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Max time"
                    type="number"
                    value={filters.total_time}
                    onChange={(e) =>
                      handleFilterChange("total_time", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="Serves"
                    type="number"
                    value={filters.serves}
                    onChange={(e) =>
                      handleFilterChange("serves", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={applyFilters}
                  >
                    Search
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recipes.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  onClick={() => setSelected(r)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell
                    style={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.title}
                  </TableCell>
                  <TableCell>{r.cuisine}</TableCell>
                  <TableCell>
                    <Rating value={r.rating || 0} readOnly precision={0.1} />
                  </TableCell>
                  <TableCell>
                    {r.total_time ? `${r.total_time} mins` : "-"}
                  </TableCell>
                  <TableCell>{r.serves}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[15, 25, 50]}
          />
        </>
      )}

      {/* Drawer for details */}
      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <Box
            sx={{
              width: 420,
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">
                {selected.title} — {selected.cuisine}
              </Typography>
              <IconButton onClick={() => setSelected(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography sx={{ mt: 2 }}>
              <strong>Description:</strong>{" "}
              {selected.description || "No description available"}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Total Time:</strong> {selected.total_time || "-"} mins
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Serves:</strong> {selected.serves || "-"}
            </Typography>
            {/* Nutrition */} {(() => { let nutrients = {}; if (typeof selected.nutrients === "object") { nutrients = selected.nutrients; } else if (typeof selected.nutrients === "string") { try { nutrients = JSON.parse(selected.nutrients); } catch { nutrients = {}; } } return ( Object.keys(nutrients).length > 0 && ( <Box sx={{ mt: 3 }}> <Typography variant="subtitle1" gutterBottom> Nutrition </Typography> <Table size="small"> <TableBody> {Object.entries(nutrients).map(([k, v]) => ( <TableRow key={k}> <TableCell> <b>{formatLabel(k)}</b> </TableCell> <TableCell>{v}</TableCell> </TableRow> ))} </TableBody> </Table> </Box> ) ); })()} {/* Ingredients */} {(() => { let ingredients = []; if (Array.isArray(selected.ingredients)) { ingredients = selected.ingredients; } else if (typeof selected.ingredients === "string") { try { ingredients = JSON.parse(selected.ingredients); } catch { ingredients = selected.ingredients.split(","); } } return ( ingredients.length > 0 && ( <Box sx={{ mt: 3 }}> <Typography variant="subtitle1">Ingredients</Typography> <ul> {ingredients.map((ing, i) => ( <li key={i}>{ing.trim()}</li> ))} </ul> </Box> ) ); })()} {/* Instructions */} {(() => { let instructions = []; if (Array.isArray(selected.instructions)) { instructions = selected.instructions; } else if (typeof selected.instructions === "string") { try { instructions = JSON.parse(selected.instructions); } catch { instructions = selected.instructions.split("."); } } return ( instructions.length > 0 && ( <Box sx={{ mt: 3 }}> <Typography variant="subtitle1">Instructions</Typography> <ol> {instructions.map((step, i) => ( <li key={i}>{step.trim()}</li> ))} </ol> </Box> ) ); })()}

            
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
