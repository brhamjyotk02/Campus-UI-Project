import { useEffect, useMemo, useState } from "react";
import { fetchDirectory } from "../services/directoryApi";
import Sidebar from "../components/Sidebar";
import useDebounce from "../hooks/useDebounce";
import "../styles/CampusDirectory.css";

const PAGE_SIZE = 8;

function CampusDirectory() {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [role, setRole] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;

    async function loadDirectory() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchDirectory();

        if (!cancelled) {
          setPeople(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Something went wrong while loading the directory."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDirectory();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, department, role, sortBy]);

  const filteredPeople = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const result = people.filter((person) => {
      const matchesSearch =
        person.name.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All" ||
        person.department === department;

      const matchesRole =
        role === "All" || person.role === role;

      return matchesSearch && matchesDepartment && matchesRole;
    });

    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "department") {
        return (
          a.department.localeCompare(b.department) ||
          a.name.localeCompare(b.name)
        );
      }

      return 0;
    });

    return result;
  }, [people, debouncedSearch, department, role, sortBy]);

  const totalPages = Math.ceil(filteredPeople.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visiblePeople = filteredPeople.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  function resetFilters() {
    setSearch("");
    setDepartment("All");
    setRole("All");
    setSortBy("name-asc");
    setCurrentPage(1);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-title"><h1>Campus Directory</h1><p>Find students and faculty across departments.</p></div>
          <button className="mobile-menu-button" onClick={() => setOpen(true)}>☰</button>
        </header>
        <section className="dashboard-content">
    <div className="directory-page">
      <div className="directory-header">
        <div>
          <p className="directory-label">CAMPUSHUB AI</p>
          <h1>Campus Directory</h1>
          <p>Find students and faculty across departments.</p>
        </div>

        <div className="directory-count">
          <strong>{loading ? "..." : filteredPeople.length}</strong>
          <span>People found</span>
        </div>
      </div>

      <div className="directory-controls">
        <div className="directory-search">
          <label htmlFor="directory-search">Search people</label>
          <input
            id="directory-search"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="directory-filter">
          <label htmlFor="department-filter">Department</label>
          <select
            id="department-filter"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>

        <div className="directory-filter">
          <label htmlFor="role-filter">Role</label>
          <select
            id="role-filter"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
          </select>
        </div>

        <div className="directory-filter">
          <label htmlFor="sort-filter">Sort by</label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="department">Department</option>
          </select>
        </div>

        <button
          className="reset-button"
          onClick={resetFilters}
          type="button"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="directory-message" role="status">
          Loading directory...
        </div>
      ) : error ? (
        <div className="directory-message error-message" role="alert">
          <h3>Unable to load directory</h3>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </button>
        </div>
      ) : filteredPeople.length === 0 ? (
        <div className="directory-message">
          <h3>No matching people found</h3>
          <p>Try changing your search or filters.</p>
          <button type="button" onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="directory-grid">
            {visiblePeople.map((person) => (
              <article className="person-card" key={person.id}>
                <div className="person-avatar" aria-hidden="true">
                  {person.name.charAt(0).toUpperCase()}
                </div>

                <div className="person-details">
                  <h2>{person.name}</h2>
                  <span
                    className={`person-role ${
                      person.role === "Faculty" ? "faculty" : "student"
                    }`}
                  >
                    {person.role}
                  </span>

                  <p className="person-department">
                    {person.department}
                  </p>

                  <a href={`mailto:${person.email}`}>
                    {person.email}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="directory-pagination">
            <p>
              Showing {startIndex + 1}–
              {Math.min(startIndex + PAGE_SIZE, filteredPeople.length)}
              {" "}of {filteredPeople.length}
            </p>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
        </section>
      </main>
    </div>
  );
}

export default CampusDirectory;